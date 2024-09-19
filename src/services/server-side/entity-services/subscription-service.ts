import { EntityService } from "./entity.service";
import { SubscriptionModel } from "../../../models/entities";
import { egress } from "../../../models/egress";
import SubscriptionDBModel, { SubscriptionDocument } from "../../../models/db/subscription.model";
import { SubscriptionTierKey } from "../../../models/enum";
import { ValidationError } from "../../../utils/exceptions";
import { StripeService } from "../stripe-service";


export class SubscriptionService extends EntityService<SubscriptionModel, SubscriptionDocument> {
    private stripeService;

    constructor() {
        super(SubscriptionDBModel);
        this.stripeService = new StripeService();
    }

    async getAll() {
        return await this.dbModel.find();
    }

    async getSubscriptionByKey(key: SubscriptionTierKey) {
        return await this.dbModel.findOne({ key })
    }

    async subscribe(req: egress.SubscriptionCreateInput, email: string) {
        const subscription: SubscriptionModel | null = await this.dbModel.findOne({ key: req.subscriptionKey });
        if (!subscription) {
            throw new ValidationError("Invalid subscription key")
        }
        await this.stripeService.subscribe(email, subscription.stripeMonthlyLookUpKey);
    }

    async createCheckout(req: egress.SubscriptionCreateInput, email: string) {
        const subscription: SubscriptionModel | null = await this.dbModel.findOne({ key: req.subscriptionKey });
        if (!subscription) {
            throw new ValidationError("Invalid subscription key")
        }
        return await this.stripeService.createCheckout(email, subscription.stripeMonthlyLookUpKey, req);
    }
}