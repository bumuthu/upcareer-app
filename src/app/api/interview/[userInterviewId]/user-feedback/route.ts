import { egress } from "@/models/egress";
import { UserFeedbackModel } from "@/models/entities";
import { UserFeedbackService } from "@/services/server-side/entity-services/user-feedback-service";
import { UserInterviewService } from "@/services/server-side/entity-services/user-interview-service";
import { handleNextError, handleNextSuccess } from "@/utils/response-generator";
import { enrichRequest, validateRequiredFields } from "@/utils/validations";

export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["rating", "userInterview"]);
        const submitInterviewFeedback = (await enrichRequest(requestBody)) as egress.UserFeedbackSubmitInput;        
        const userInterviewService = new UserInterviewService();
        const userInterview = await userInterviewService.get(submitInterviewFeedback.userInterview as string);
        const newFeedbackModel: UserFeedbackModel = {
            rating: submitInterviewFeedback.rating,
            comment: submitInterviewFeedback.comment!,
            userInterview: submitInterviewFeedback.userInterview,
            baseInterview: userInterview.baseInterview,
            user: submitInterviewFeedback.userId!
        };
        const userFeedbackService = new UserFeedbackService()
        const res = await userFeedbackService.create(newFeedbackModel);
        return handleNextSuccess(res);
    } catch (error) {
        console.log("Error in POST: interview/:id/user-feedback", error)
        return handleNextError(error)
    }
}