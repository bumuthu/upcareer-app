import { SubscriptionEventType, SubscriptionStatus, SubscriptionTierKey, UserInterviewStatus, UserStatus } from "./enum";


export interface Entity {
    _id?: any;
}



// User related
export interface Notification {
    createdAt: number,
    title: string,
    description: string,
    hasRead: boolean
}
export interface UserModel extends Entity {
    name: string,
    email: string,
    status: UserStatus,
    providerUserId: string,
    notifications: Notification[],
    resumeUrl?: string,
    createdAt: number,
    stripeSubscriptionId?: string,
    subscription?: string | SubscriptionModel, // defaulting to Free tier
    subscriptionStatus?: SubscriptionStatus,
    subscriptionEvents: UserSubscritipnEvent[],
    subscriptionUsages: UserSubscriptionUsage[], // past usages
    subscriptionCurrentUsage?: UserSubscriptionUsage // current usage
}
export interface UserSubscritipnEvent {
    eventType: SubscriptionEventType,
    tier: string | SubscriptionModel,
    createdAt: number
}
export interface UserSubscriptionUsage {
    usedCredits: number,
    billingCycleStartsAt: number,
    billingCycleEndsAt: number
}



// Subscription related
export interface SubscriptionModel extends Entity {
    key: SubscriptionTierKey,
    price: number,
    stripeMonthlyLookUpKey: string,
}



// Base Interview related
export interface BaseInterviewModel extends Entity {
    title: string,
    jobDescription: string,
    aboutInterview: string,
    category: string,
    keywords: string[],
    saves?: number,
    uses?: number,
    rating?: number,
    openAIAssistantId: string,
    opneAIVectorStoreId: string
}



// User Interview related
export interface ResumeMacthingScoreModel {
    score: number,
    matchingTexts: string[]
}
export interface UserMatchingScoreModel {
    experienceScore: ResumeMacthingScoreModel,
    skillsScore: ResumeMacthingScoreModel,
    educationScore: ResumeMacthingScoreModel,
    createdAt: number
}
export interface UserInterviewScoreModel {
    technicalScore: number,
    communicationScore: number,
    confidenceScore: number,
    overallFeedback: string
}
export interface UserInterviewModel extends Entity {
    user: string | UserModel,
    baseInterview: string | BaseInterviewModel,
    jobDescription?: string, // append to baseInterview jobDescription
    resumeMatchingScores?: UserMatchingScoreModel,
    interviewScores?: UserInterviewScoreModel, // if status is COMPLETED, required
    status: UserInterviewStatus,
    startedAt: number,
    duration: number // in minutes
}



// Dialogue related
export interface DialogueFeedback {
    score: number,
    feedback: string
}
export interface DialogueModel extends Entity {
    text: string,
    userInterview: string | UserInterviewModel,
    parentDialogue?: string | DialogueModel,
    askedBy?: string | UserModel, // if not AI, userId
    askedByAI?: boolean, // If AI, set to true
    feedback?: DialogueFeedback
    createdAt: number
}



// System Parameter related
export interface CategoryModel extends Entity {
    name: string
}
export interface KeywordModel extends Entity {
    name: string
}
export interface SystemParameterModel extends Entity {
    categories: CategoryModel[],
    keywords: KeywordModel[],
    superAdminEmails: string[],
}