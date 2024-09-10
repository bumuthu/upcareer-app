import { egress } from "../models/egress";
import { AuthService } from "../services/auth-service";
import { UserService } from "../services/entity-services/user-service";
import { ValidationError } from "../utils/exceptions";

export function ValidateFields(data: any, model: any) {
    type MakeRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & { [P in K]-?: Exclude<T[P], undefined> }

    function checkField<T, K extends keyof T>(o: T | MakeRequired<T, K>, field: K): o is MakeRequired<T, K> {
        return !!o[field]
    }
    Object.keys(typeof model).map(key => {
        console.log("Data", data)
        console.log("Key", key)
        console.log("Validity", checkField(data, key))
    });
}

export function validationWithEnum<T>(type: T, data: any, field: string) {
    const keys = Object.keys(type as any);
    if (!data[field] && !keys.includes(data[field])) throw new ValidationError(`Invalid value for, [${field}]`)
}

export function validateRequiredFields(data: any, fields: string[]) {
    let nullFields: string[] = [];
    let hasError: boolean = false;
    if (data == null && fields.length != 0) throw new ValidationError(`Missing one or more required fields`);
    for (let key of fields) {
        if (data[key] == undefined) {
            nullFields.push(key);
            hasError = true;
        }
    }
    if (hasError) throw new ValidationError(`Missing required fields, [${nullFields.join()}]`)
}

export function validateAllowedFields(data: any, fields: string[]) {
    let unknownFields: string[] = [];
    let hasError: boolean = false;
    if (data == null) return;
    Object.keys(data).forEach(key => {
        if (!fields.includes(key)) {
            unknownFields.push(key);
            hasError = true;
        }
    });
    if (hasError) throw new ValidationError(`Contains invalid fields, [${unknownFields.join()}]`)
}

export async function enrichRequest( request?: egress.Request): Promise<egress.Request> {
    console.log("Request:", request);
    if (request == null) request = {};

    const authUser = await AuthService.getUser();
    const userService = new UserService();
    const user = await userService.getUserByEmail(authUser.email);
    request.userId = user?._id.toString();
    return request;
}  