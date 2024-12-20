import { InterviewNode, UserInterviewModel } from "./entities"
import { EndingReason, InterviewDifficulty, InterviewMode, SubscriptionTierKey, UserInterviewStatus } from "./enum"

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

    //User related

    export interface UserUpdateInput extends Request {
    name?: string,
    }

    // Prompt related
    export interface InterviewAnswerPrompt extends Request {
        dialogueId: string
        userInterviewId: string
    }
    export interface InterviewOrganizePrompt extends Request {
        userInterviewId: string
    }
    export interface DialogueCreateInput extends Request {
        userInterviewId: string,
        userAnswer?: string
        systemQuestion?: string,
        parentDialogueId?: string
    }
    export interface DialogueUpdateInput extends Request {
        dialogueId: string,
        userAnswer?: string,
        systemQuestion?: string
    }

    // Intervew related
    export interface BaseInterviewQueryInput extends Request {
        searchText?: string,
        categoryId?: string
    }
    export interface BaseInterviewSingleQueryInput extends Request {
        baseInterviewId: string,
    }

    export interface UserInterviewQueryInput extends Request {
        userInterviewId: string
    }

    export interface UserInterviewsQueryInput extends Request {
        userId: string
    }

    export interface UserInterviewCreateInput extends Request {
        baseInterviewId: string,
        difficulty: InterviewDifficulty,
        mode: InterviewMode
    }

    export interface UserInterviewUpdateInput extends Request {
        userInterviewId: string,
        jobDescription?: string,
        startedAt?: number,
        endedAt?: number,
        endingReason?: EndingReason,
        status?: UserInterviewStatus,
        nodes?: { [id: string]: InterviewNode };
        currentNodeId?: string
    }
    //Interview feedback
    export interface UserFeedbackSubmitInput extends Request {
        rating: number,
        comment?: string,
        userInterview: string | UserInterviewModel,
        
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