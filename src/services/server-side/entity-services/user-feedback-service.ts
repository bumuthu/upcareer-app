import { UserFeedbackModel } from "@/models/entities";
import { EntityService } from "./entity.service";
import UserFeedbackDBModel, { UserFeedbackDocument } from "@/models/db/interview-feedback.model";


export class UserFeedbackService extends EntityService<UserFeedbackModel, UserFeedbackDocument> {
    constructor() {
        super(UserFeedbackDBModel);
    }
    
}