import { BaseInterviewService } from "../../../../services/entity-services/base-interview-service";
import { handleNextError, handleNextSuccess } from "../../../../utils/response-generator";

export const GET = async (req: Request) => {
    try {
        const baseInterviewService = new BaseInterviewService();
        const baseInterviews = await baseInterviewService.getBaseInterviews({});
        return handleNextSuccess(baseInterviews)
    } catch (error) {
        console.log("Error in GET:/public/base-interviews", error)
        return handleNextError(error);
    }
}

