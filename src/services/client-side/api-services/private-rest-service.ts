import { RestClient } from "./rest-client";
import { BaseInterviewModel, SubscriptionModel, UserModel } from "../../../models/entities";
import { egress } from "../../../models/egress";
import { ingress } from "../../../models/ingress";

export class PrivateRestService {
    private restClient: RestClient;

    constructor(unauthorizedCallback?: () => void) {
        this.restClient = new RestClient(false, unauthorizedCallback);
    }

    // User related
    async getUser(): Promise<UserModel> {
        return this.restClient.get<UserModel>("user", undefined);
    }

    // Subscription related
    async getAllSubscriptions(): Promise<SubscriptionModel[]> {
        return this.restClient.get<SubscriptionModel[]>("subscription")
    }
    async createCheckout(subscriptionData: egress.SubscriptionCreateInput): Promise<ingress.CheckoutSessionResponse> {
        return this.restClient.post<ingress.CheckoutSessionResponse>("subscription", subscriptionData)
    }
    async getStripeDetails(stripeData: egress.StripeDetailsInput): Promise<ingress.StripeDetailsResponse> {
        return this.restClient.get<ingress.StripeDetailsResponse>(`stripe/${stripeData.userId}`)
    }
}