import { RestClient } from "./rest-client";
import { DialogueModel, SubscriptionModel, UserInterviewModel, UserModel } from "../../../models/entities";
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
    async updateUser(userData: egress.UserUpdateInput): Promise<UserModel>{
        return this.restClient.put<UserModel>(`user/${userData.userId}`, userData);
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
    async getUserInterviews() {
        return this.restClient.get<UserInterviewModel[]>('user-interviews')
    }
    async getUserInterviewById(interviewData: egress.UserInterviewQueryInput): Promise<UserInterviewModel>{
        return this.restClient.get<UserInterviewModel>(`interview/${interviewData.userInterviewId}`)
    }
    async updateUserInterview(interviewData: egress.UserInterviewUpdateInput): Promise<UserInterviewModel> {
        return this.restClient.put<UserInterviewModel>(`interview/${interviewData.userInterviewId}`, interviewData)
    }

    // AI related
    async promptInterviewAnswer(promptData: egress.InterviewAnswerPrompt) {
        return this.restClient.post<ingress.InterviewPromptResponse>('interview/ai/answer', promptData)
    }
    async organizeInterviewPrompts(promptData: egress.InterviewOrganizePrompt) {
        return this.restClient.post<ingress.InterviewPromptResponse[]>('interview/ai/organize', promptData)
    }
    
    // Dialogue related
    async createDialogue(dialogueData: egress.DialogueCreateInput) {
        return this.restClient.post<DialogueModel>('interview/dialogue', dialogueData)
    }
    async updateDialogue(dialogueData: egress.DialogueUpdateInput) {
        return this.restClient.put<DialogueModel>('interview/dialogue', dialogueData)
    }

    // Speech API
    async getSpeechToken(): Promise<ingress.SpeechTokenResponse> {
        return this.restClient.get<ingress.SpeechTokenResponse>(`speech-token`)
    }
}