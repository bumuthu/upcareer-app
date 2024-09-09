import { NextApiResponse } from "next";
import { ErrorCode } from "./error-codes";

export default class ResponseGenerator {
    private status: number | undefined;
    private response: any;

    private getResponse() {
        return {
            statusCode: this.status,
            body: JSON.stringify({
                ...this.response
            }),
        };
    }

    public handleSuccessfullResponse(data: any) {
        this.response = { payload: data };
        this.status = 200;
        return this.getResponse();
    }

    public handleDataNotFound(type: string, id?: string) {
        this.response = { errorMessage: `${type} data with id ${id} not found` };
        this.status = 400;
        return this.getResponse();
    }

    public handleCouldntInsert(type: string) {
        this.response = { errorMessage: `Server couldn't insert ${type} data` };
        this.status = 400;
        return this.getResponse();
    }

    public handleGenericError(err: string) {
        this.response = { errorMessage: `Server returns error: \n${err}` };
        this.status = 400;
        return this.getResponse();
    }

    public handleBusinessLoginError(err: string) {
        this.response = { errorMessage: `Server returns error: \n${err}` };
        this.status = 500;
        return this.getResponse();
    }

    public handleAuthorizationError() {
        this.response = { errorMessage: `Invalid authorization token` };
        this.status = 401;
        return this.getResponse();
    }

    public handleUserLoginError(err: { message: string, code: string }) {
        this.response = {
            errorMessage: "User login failed",
            reason: err.message,
            code: err.code
        };
        this.status = 401;
        return this.getResponse();
    }

    public handleUserRegistrationError(err: { message: string, code: string }) {
        this.response = {
            errorMessage: "User registraion failed",
            reason: err.message,
            code: err.code
        };
        this.status = 400;
        return this.getResponse();
    }
}


export interface ErrorResponse {
    status: number,
    code: ErrorCode,
    message: string
}

export function handleNextSuccess(data: any) {
    return new Response(JSON.stringify(data), {
        status: 200,
    })
}

export function handleNextError(error: any) {
    let status = error.status;
    let code = error.code;
    if (Object.values(ErrorCode).includes(error.code) == false) {
        status = 500;
        code = ErrorCode.INTERNAL_SERVER_ERROR;
    }
    return new Response(JSON.stringify({ code, message: error.message }), {
        status,
    })
}