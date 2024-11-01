import { egress } from "@/models/egress";
import { InterviewFeedbackModel } from "@/models/entities";
import { EntityService } from "@/services/server-side/entity-services/entity.service";
import { UserFeedbackService } from "@/services/server-side/entity-services/user-feedback-service";
import { UserInterviewService } from "@/services/server-side/entity-services/user-interview-service";
import { handleNextError, handleNextSuccess } from "@/utils/response-generator";
import { enrichRequest, validateRequiredFields } from "@/utils/validations";

export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["rating"]);
        const submitInterviewFeedback = (await enrichRequest(requestBody)) as egress.UserFeedbackSubmitInput;        
        const userInterviewService = new UserInterviewService();
        const userInterview = await userInterviewService.get(submitInterviewFeedback.userInterviewId);

        const newFeedbackModel: InterviewFeedbackModel = {
            rating: submitInterviewFeedback.rating,
            comment: submitInterviewFeedback.comment!,
            userInterviewId: userInterview._id,
            baseInterviewId: userInterview.baseInterview as string,
            userId: submitInterviewFeedback.userId!
        };
        const userFeedbackService = new UserFeedbackService()
        const res = await userFeedbackService.create(newFeedbackModel);
        return handleNextSuccess(res);
    } catch (error) {
        console.log("Error in POST: interview/:id/user-feedback")
        return handleNextError(error)
    }
}