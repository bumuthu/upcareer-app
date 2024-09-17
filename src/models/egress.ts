
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

    // intervew related
    export interface BaseInterviewQueryInput extends Request {
        baseInterviewId?: string,
        searchText?: string,
        categoryId?: string
    }
}