import { SubscriptionTierKey } from "./enum"

export namespace egress {

    export interface Request {
        requestId?: string
        userId?: string,
    }

    // Auth related
    export interface LogInInput extends Request {
        email: string,
        password: string
    }
    export interface SignUpInput extends Request {
        providerUserId: string,
        email: string,
        name: string
    }

    // Prompt related
    export interface InterviewPrompt extends Request {
        promptId: string
    }
    export interface DialogueCreateInput extends Request {
        userInterviewId: string,
        text: string
        parentDialogueId?: string
    }

    // intervew related
    export interface BaseInterviewQueryInput extends Request {
        searchText?: string,
        categoryId?: string
    }
    export interface BaseInterviewSingleQueryInput extends Request {
        baseInterviewId: string,
    }

    export interface UserInterviewQueryInput extends Request {
        userInterviewId?: string
    }

    export interface UserInterviewCreateInput extends Request {
        baseInterviewId: string,
    }

    export interface UserInterviewUpdateInput extends Request {
        userInterviewId: string,
        jobDescription?: string
    }

    export interface UserInterviewPromptInput extends Request {
        promptId: string
    }



    // Subscription
    export interface SubscriptionCreateInput extends Request {
        userId: string,
        subscriptionKey: SubscriptionTierKey
    }
    export interface StripeDetailsInput extends Request {
        userId: string,
    }
}