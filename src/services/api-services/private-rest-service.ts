import { RestClient } from "./rest-client";
import { BaseInterviewModel, UserModel } from "../../models/entities";
import { egress } from "../../models/egress";

export class PrivateRestService {
    private restClient: RestClient;

    constructor(unauthorizedCallback?: () => void) {
        this.restClient = new RestClient(false, unauthorizedCallback);
    }

    // User related
    async getUser(): Promise<UserModel> {
        return this.restClient.get<UserModel>("user", undefined);
    }
}