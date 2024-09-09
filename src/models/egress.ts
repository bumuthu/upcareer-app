
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
}