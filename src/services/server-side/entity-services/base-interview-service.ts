import { baseInterviews } from "../../../data/base-interviews";
import BaseInterviewDBModel, { BaseInterviewDocument } from "../../../models/db/base-interview.model";
import { egress } from "../../../models/egress";
import { BaseInterviewModel } from "../../../models/entities";
import { EntityService } from "./entity.service";

export class BaseInterviewService extends EntityService<BaseInterviewModel, BaseInterviewDocument> {

    constructor() {
        super(BaseInterviewDBModel);
    }

    async getBaseInterviews(queryInput: egress.BaseInterviewQueryInput): Promise<BaseInterviewModel[]> {
        console.log("Mocking base interviews response")
        return baseInterviews;
    }
}