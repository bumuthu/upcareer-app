import Stripe from 'stripe';
import { InternalServerError } from '../../utils/exceptions';
import { SubscriptionService } from './entity-services/subscription-service';
import { SubscriptionEventType, SubscriptionStatus, SubscriptionTierKey } from '../../models/enum';
import { ingress } from '../../models/ingress';
import { UserService } from './entity-services/user-service';
import { UserModel } from '../../models/entities';
import { egress } from '../../models/egress';

export class StripeService {
    private stripe: Stripe;

    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("Stripe config not found")
            throw new InternalServerError();
        }
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-04-10',
        });
    }

    async subscribe(email: string, lookupKey: string) {
        let customer;
        try {
            customer = await this.stripe.customers.retrieve(email);
        } catch (err) {
            console.log("No exisitng customer found")
            customer = await this.stripe.customers.create({ email })
        }
        const priceRes = await this.stripe.prices.list({ lookup_keys: [lookupKey] });
        const priceId = priceRes.data[0].id
        const subscription = await this.stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            expand: ["latest_invoice.payment_intent"],
        });
        console.log("Subscription creation successfully completed", subscription)
    }

    async constructEvent(body: string, signature: string) {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error("Stripe config not found")
            throw new InternalServerError();
        }
        try {
            return this.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err: any) {
            console.error('Error verifying Stripe webhook signature:', err);
            throw new Error("Invalid Stripe signature")
        }
    }

    async handleWebhook(body: string, signature: string) {
        const event = await this.constructEvent(body, signature)
        // console.log(event.type, JSON.stringify(event))
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object)
                break;
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object);
                break;
        }
    }

    async handleCheckoutCompleted(subscription: Stripe.Checkout.Session) {
        console.log('Stripe checkout completed event:', JSON.stringify(subscription));

        const subscriptionService = new SubscriptionService();
        const subscriptionTier = await subscriptionService.getSubscriptionByKey(subscription.metadata?.subscriptionKey as SubscriptionTierKey);

        const userService = new UserService();
        const user = await userService.get(subscription.metadata?.userId!);

        const nowAt = Date.now();
        const subscriptionEvents = [...user.subscriptionEvents]

        if (user.stripeSubscriptionId) {
            await this.stripe.subscriptions.cancel(user.stripeSubscriptionId)
            subscriptionEvents.push({
                eventType: SubscriptionEventType.SUBSCRIPTION_UPGRADED,
                tier: subscriptionTier?._id as string,
                createdAt: nowAt,
            })
            console.log('Existing subscription cancelled with id:', user.stripeSubscriptionId);
        }

        const subscriptionUsages = [...user.subscriptionUsages];
        if (user.subscriptionCurrentUsage) {
            subscriptionUsages.push(user.subscriptionCurrentUsage)
        }
        const updatedWorkspace = await userService.update(subscription.metadata?.userId!, {
            stripeSubscriptionId: subscription.subscription,
            subscription: subscriptionTier?._id,
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionCurrentUsage: {
                usedCredits: 0,
                usedChats: 0,
                billingCycleStartsAt: nowAt
            },
            subscriptionUsages: subscriptionUsages,
            subscriptionEvents: [
                ...subscriptionEvents,
                {
                    eventType: SubscriptionEventType.PAYMENT_SUCCESS,
                    tier: subscriptionTier?._id,
                    createdAt: nowAt,
                },
                {
                    eventType: SubscriptionEventType.BILLING_CYCLE_STARTED,
                    tier: subscriptionTier?._id,
                    createdAt: nowAt,
                }],
        })
        console.log("Updated workspace", updatedWorkspace);

        const subscriptionWithLatestPaymentIntent = await this.stripe.subscriptions.retrieve(
            subscription.subscription as string, {
            expand: ["latest_invoice.payment_intent"]
        })
        console.log("Subscription with latest payment intent:", JSON.stringify(subscriptionWithLatestPaymentIntent))
        const stripeUpdateRes = await this.stripe.subscriptions.update(subscription.subscription as string, {
            default_payment_method: ((subscriptionWithLatestPaymentIntent.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent).payment_method as string,
        })
        console.log("Updated subscription", stripeUpdateRes)
    }

    async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
        console.log('Stripe subscription updated event:', JSON.stringify(subscription));

        const userService = new UserService();
        const user: UserModel = await userService.getUserByStripeSubscriptionId(subscription.id);
        if (!user) {
            console.log("Skipping processing subscription updated event.")
            return;
        }
        let update;
        switch (subscription.status) {
            case 'past_due':
                update = {
                    subscriptionStatus: SubscriptionStatus.PAUSED,
                    subscriptionEvents: [
                        ...user.subscriptionEvents,
                        {
                            eventType: SubscriptionEventType.SUBSCRIPTION_PAUSED,
                            tier: user.subscription,
                            createdAt: Date.now(),
                        }
                    ]
                };
                break;
            case 'active':
                const nowAt = Date.now();
                const subscriptionUsages = [...user.subscriptionUsages];
                if (user.subscriptionCurrentUsage) {
                    subscriptionUsages.push(user.subscriptionCurrentUsage)
                }
                update = {
                    subscriptionStatus: SubscriptionStatus.ACTIVE,
                    subscriptionUsages: subscriptionUsages,
                    subscriptionCurrentUsage: {
                        usedCredits: 0,
                        billingCycleStartsAt: nowAt
                    },
                    subscriptionEvents: [
                        ...user.subscriptionEvents,
                        {
                            eventType: SubscriptionEventType.BILLING_CYCLE_STARTED,
                            tier: user.subscription,
                            createdAt: nowAt,
                        }
                    ]
                };
                break;
        }
        console.log("Subscription update:", update)
        const subscriptionUpdated = await userService.update(user._id, update);
        console.log("Updated subscription", subscriptionUpdated)
    }

    async createCheckout(email: string, lookupKey: string, checkoutData: egress.SubscriptionCreateInput) {
        const priceRes = await this.stripe.prices.list({ lookup_keys: [lookupKey] });
        const priceId = priceRes.data[0].id
        const session = await this.stripe.checkout.sessions.create({
            mode: 'subscription',
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                subscriptionKey: checkoutData.subscriptionKey,
                userId: checkoutData.userId!
            },
            payment_method_types: ['card'],
            ui_mode: 'embedded',
            return_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/settings?tab=subscription&session_id={CHECKOUT_SESSION_ID}`,
        });
        return { clientSecret: session.client_secret };
    }

    async getSubscriptionDetails(subscriptionId: string): Promise<ingress.StripeDetailsResponse> {
        let stripeDetailsResponse: ingress.StripeDetailsResponse = {
            defaultCard: false
        };
        if (!subscriptionId) {
            return stripeDetailsResponse;
        }

        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
            expand: ["default_payment_method"]
        });
        if (subscription.default_payment_method) {
            const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;
            if (paymentMethod && paymentMethod.type === 'card') {
                stripeDetailsResponse.defaultCard = true;
                stripeDetailsResponse.cardEndingNumbers = paymentMethod.card!.last4;
                stripeDetailsResponse.cardBrand = paymentMethod.card!.brand;
            }
        }
        return stripeDetailsResponse;
    }
}