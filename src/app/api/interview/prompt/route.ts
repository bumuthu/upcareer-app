import { egress } from "../../../../models/egress";
import { CoreService } from "../../../../services/server-side/core-service";
import { handleNextError, handleNextSuccess } from "../../../../utils/response-generator";
import { enrichRequest, validateRequiredFields } from "../../../../utils/validations";

export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["promptId"]);
        const propmptRequest = await enrichRequest(requestBody) as egress.InterviewPrompt;

        const coreService: CoreService = new CoreService();
        const res = await coreService.handleSpeechPrompt(propmptRequest.promptId)
        return handleNextSuccess(res)
    } catch (error) {
        console.log("Error in POST:interview/prompt", error)
        return handleNextError(error);
    }
}

