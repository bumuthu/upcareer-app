import { egress } from "../../../models/egress";
import { BaseInterviewModel, CategoryModel, SystemParameterModel, UserModel } from "../../../models/entities";
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

    // Base interview related
    async queryBaseInterviews(queryInput: egress.BaseInterviewQueryInput): Promise<BaseInterviewModel[]> {
        return this.restClient.get<BaseInterviewModel[]>("public/base-interviews", queryInput);
    }
    async queryBaseInterviewById(queryInput: egress.BaseInterviewSingleQueryInput): Promise<BaseInterviewModel> {
        return this.restClient.get<BaseInterviewModel>(`public/base-interviews/${queryInput.baseInterviewId}`);
    }

    // System level
    async getSystemParams(): Promise<SystemParameterModel> {
        return this.restClient.get<SystemParameterModel>("public/system-parameter")
    }
    async getCategories(): Promise<CategoryModel[]> {
        return this.restClient.get<CategoryModel[]>("public/categories")
    }
}