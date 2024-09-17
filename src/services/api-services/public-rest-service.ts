import { egress } from "../../models/egress";
import { UserModel } from "../../models/entities";
import { RestClient } from "./rest-client";


export class PublicRestService {
    private restClient: RestClient;

    constructor() {
        this.restClient = new RestClient(true);
    }

    // User related
    async createUser(userCreateData: egress.SignUpInput): Promise<UserModel> {
        return this.restClient.post<UserModel>("public/user", userCreateData);
    }
}