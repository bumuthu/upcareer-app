import { UserInterviewModel } from "@/models/entities";
import { EntityService } from "./entity.service";
import UserInterviewDBModel, {
    UserInterviewDocument,
} from "@/models/db/user-interview.model";
import { egress } from "@/models/egress";
import { UserInterviewStatus } from "@/models/enum";

export class UserInterviewService extends EntityService<UserInterviewModel, UserInterviewDocument> {
    constructor() {
        super(UserInterviewDBModel);
    }

    async createUserInterview(data: egress.UserInterviewCreateInput): Promise<UserInterviewModel> {
        await this.before();

        const newInterviewModel: UserInterviewModel = {
            user: data.userId as string,
            baseInterview: data.baseInterviewId,
            status: UserInterviewStatus.INITIALIZED,
        };
        return await this.create(newInterviewModel);
    }

    async getUserInterviewById(queryInput: egress.UserInterviewQueryInput): Promise<UserInterviewModel | null> {
        await this.before();
        return await this.dbModel.findOne({ id: queryInput.userInterviewId });
    }
}
