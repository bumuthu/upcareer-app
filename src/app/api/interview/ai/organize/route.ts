import { egress } from "../../../../../models/egress";
import { BaseInterviewModel } from "../../../../../models/entities";
import { UserInterviewService } from "../../../../../services/server-side/entity-services/user-interview-service";
import { InterviewEngine } from "../../../../../services/server-side/interview-engine";
import { handleNextError, handleNextSuccess } from "../../../../../utils/response-generator";
import { enrichRequest, validateRequiredFields } from "../../../../../utils/validations";


export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["userInterviewId"]);
        const organizeRequest = await enrichRequest(requestBody) as egress.InterviewOrganizePrompt;

        const userInterviewService = new UserInterviewService();
        const userInterview = await userInterviewService.get(organizeRequest.userInterviewId, "baseInterview");

        const interviewEngine: InterviewEngine = new InterviewEngine((userInterview?.baseInterview as BaseInterviewModel).openAIAssistantId);
        const organizePromptRes = await interviewEngine.handleOrganizePrompt(userInterview);
        return handleNextSuccess(organizePromptRes)
    } catch (error) {
        console.log("Error in POST:interview/ai/organize", error)
        return handleNextError(error);
    }
}