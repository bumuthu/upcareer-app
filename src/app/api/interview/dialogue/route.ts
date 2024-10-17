import { egress } from "../../../../models/egress";
import { DialogueService } from "../../../../services/server-side/entity-services/dialogue-service";
import { handleNextError, handleNextSuccess } from "../../../../utils/response-generator";
import { enrichRequest, validateRequiredFields } from "../../../../utils/validations";

export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["userInterviewId"]);
        const dialogueRequest = await enrichRequest(requestBody) as egress.DialogueCreateInput;

        const dialogueService = new DialogueService();
        const res = await dialogueService.create({ text: dialogueRequest.userAnswer, userInterview: dialogueRequest.userInterviewId, createdAt: Date.now() })
        return handleNextSuccess(res)
    } catch (error) {
        console.log("Error in POST:interview/dialogue", error)
        return handleNextError(error);
    }
}


export const PUT = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["dialogueId"]);
        const dialogueRequest = await enrichRequest(requestBody) as egress.DialogueUpdateInput;

        const dialogueService = new DialogueService();
        const res = await dialogueService.update(dialogueRequest.dialogueId, { text: dialogueRequest.userAnswer })
        return handleNextSuccess(res)
    } catch (error) {
        console.log("Error in PUT:interview/dialogue", error)
        return handleNextError(error);
    }
}

