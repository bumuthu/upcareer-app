import { egress } from "../../../../../models/egress";
import { BaseInterviewModel } from "../../../../../models/entities";
import { UserInterviewService } from "../../../../../services/server-side/entity-services/user-interview-service";
import { InterviewEngine } from "../../../../../services/server-side/interview-engine";
import { handleNextError, handleNextSuccess } from "../../../../../utils/response-generator";
import { enrichRequest, validateRequiredFields } from "../../../../../utils/validations";


export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["dialogueId", "userInterviewId"]);
        const promptRequest = await enrichRequest(requestBody) as egress.InterviewAnswerPrompt;

        const userInterviewService = new UserInterviewService();
        const userInterview = await userInterviewService.get(promptRequest.userInterviewId, "baseInterview");

        const interviewEngine: InterviewEngine = new InterviewEngine((userInterview?.baseInterview as BaseInterviewModel).openAIAssistantId, userInterview);
        const userPromptRes = await interviewEngine.handleAnswerPrompt(promptRequest.dialogueId);
        return handleNextSuccess(userPromptRes)
    } catch (error) {
        console.log("Error in POST:interview/ai/answer", error)
        return handleNextError(error);
    }
}
