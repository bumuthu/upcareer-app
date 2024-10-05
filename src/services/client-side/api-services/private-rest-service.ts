import { RestClient } from "./rest-client";
import { SubscriptionModel, UserInterviewModel, UserModel } from "../../../models/entities";
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

    //User interview related
    async createUserInterview(interviewData: egress.UserInterviewCreateInput) {
        return this.restClient.post<UserInterviewModel>('interview', interviewData)
    }
    async getUserInterviewById(interviewData: egress.UserInterviewQueryInput): Promise<UserInterviewModel> {
        return this.restClient.get<UserInterviewModel>(`interview/${interviewData.userInterviewId}`)
    }
    async updateUserInterview(interviewData: egress.UserInterviewUpdateInput): Promise<UserInterviewModel> {
        return this.restClient.put<UserInterviewModel>(`interview/${interviewData.userInterviewId}`, interviewData)
    }
    async createUserPrompt(promptData: egress.UserInterviewPromptInput) {
        return await fetch('/api/interview/prompt', {
            method: 'POST',
            body: JSON.stringify(promptData)
        })
    }
}