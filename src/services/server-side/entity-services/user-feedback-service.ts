import { InterviewFeedbackModel } from "@/models/entities";
import { EntityService } from "./entity.service";
import { InterviewFeedbackDocument } from "@/models/db/interview-feedback.model";


export class UserFeedbackService extends EntityService<InterviewFeedbackModel, InterviewFeedbackDocument> {
    constructor() {
        super(InterviewFeedbackModel);
    }
    
}