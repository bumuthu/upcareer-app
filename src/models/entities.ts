import { EndingReason, SubscriptionEventType, SubscriptionStatus, SubscriptionTierKey, UserInterviewStatus, UserStatus } from "./enum";


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
    lookupKey: string,
    jobDescription: string,
    aboutInterview: string,
    category: string | CategoryModel,
    keywords: string[],
    saves?: number,
    uses?: number,
    rating?: number,
    openAIAssistantId: string,
}



// User Interview related
export interface InterviewNode {
    id: string;
    isParentNode: boolean;
    question: string;
    expectedAnswer: string;
    previousAnswerFeedback?: string,
    userAnswer?: string;
    dialogueId?: string;
    parentNodeId?: string; // null for parent node
    previousNodeId?: string; // null for the first node
    nextNodeId?: string; // null for the last node
    scores?: QuestionScoreModel
}
export interface MacthingScoreModel {
    score: number,
    matchingTexts: string[]
}
export interface QuestionScoreModel {
    communication: number,
    accuracy: number,
    confidence: number,
    feedback?: string
}
export interface UserInterviewModel extends Entity {
    user: string | UserModel,
    baseInterview: string | BaseInterviewModel,
    jobDescription?: string, // append to baseInterview jobDescription
    interviewScores?: QuestionScoreModel, // if status is COMPLETED, required
    status: UserInterviewStatus,
    startedAt?: number,
    endedAt?: number,
    endingReason?: EndingReason,
    nodes?: { [id: string]: InterviewNode }
    currentNodeId?: string
}


//Interview feedback related
export interface UserFeedbackModel extends Entity {
    rating: number,
    comment?: string,
    userInterview: string | UserInterviewModel,
    baseInterview: string | BaseInterviewModel,
    user: string | UserModel
}


// Dialogue related
export interface DialogueFeedback {
    score: number,
    feedback: string
}
export interface DialogueModel extends Entity {
    userInterview: string | UserInterviewModel,
    userAnswer?: string,
    systemQuestion?: string,
    parentDialogue?: string | DialogueModel,
    feedback?: DialogueFeedback
    createdAt?: number
}



// System Parameter related
export interface CategoryModel extends Entity {
    name: string,
    lookupKey: string
}
export interface SystemParameterModel extends Entity {
    superAdminEmails: string[],
}