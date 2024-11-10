import { egress } from "@/models/egress";
import { UserInterviewModel } from "@/models/entities";
import { UserInterviewStatus } from "@/models/enum";
import { UserInterviewService } from "@/services/server-side/entity-services/user-interview-service";
import { handleNextError, handleNextSuccess } from "@/utils/response-generator";
import { enrichRequest, validateRequiredFields } from "@/utils/validations";
import { BaseInterviewService } from "../../../services/server-side/entity-services/base-interview-service";

export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["baseInterviewId"]);
        const createUserInterview = (await enrichRequest(requestBody)) as egress.UserInterviewCreateInput;

        const userInterviewService = new UserInterviewService();
        const newInterviewModel: UserInterviewModel = {
            user: createUserInterview.userId!,
            baseInterview: createUserInterview.baseInterviewId,
            status: UserInterviewStatus.INITIALIZED,
        };
        const res = await userInterviewService.create(newInterviewModel, "baseInterview");
        return handleNextSuccess(res);
    } catch (error) {
        console.log("Error in POST: interview/id");
        return handleNextError(error);
    }
};

