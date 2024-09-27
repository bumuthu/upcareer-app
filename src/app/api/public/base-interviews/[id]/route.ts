import { BaseInterviewService } from "@/services/server-side/entity-services/base-interview-service";
import { handleNextError, handleNextSuccess } from "@/utils/response-generator";

export const GET = async (req: Request) => {
    try {
        const splits = req.url.split("/");
        const baseInterviewId = splits[splits.length - 1];

        const baseInterviewService = new BaseInterviewService();
        const baseInterview = await baseInterviewService.get(baseInterviewId, "category");
        return handleNextSuccess(baseInterview);
    } catch (error) {
        console.log("Error in GET:/public/base-interviews/:id", error);
        return handleNextError(error);
    }
};
