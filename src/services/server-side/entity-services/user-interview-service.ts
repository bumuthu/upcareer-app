import { UserInterviewModel } from "@/models/entities";
import { EntityService } from "./entity.service";
import UserInterviewDBModel, {
    UserInterviewDocument,
} from "@/models/db/user-interview.model";
import { egress } from "@/models/egress";

export class UserInterviewService extends EntityService<UserInterviewModel, UserInterviewDocument> {
    constructor() {
        super(UserInterviewDBModel);
    }

    async getUserInterviewById(queryInput: egress.UserInterviewQueryInput): Promise<UserInterviewModel | null> {
        await this.before();
        return await this.dbModel.findOne({ id: queryInput.userInterviewId });
    }

    async getUserInterviews(queryInput: egress.UserInterviewsQueryInput): Promise<UserInterviewModel[] | null>{
        await this.before();
        return await this.dbModel.find({user: queryInput.userId}).populate('baseInterview') as any
    }
}
