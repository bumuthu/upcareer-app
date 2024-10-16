import { ServerAuthService } from "../../../services/server-side/server-auth-service";
import { handleNextError, handleNextSuccess } from "../../../utils/response-generator";
import { AzureAIAssistantService } from "../../../services/server-side/azure-ai-assistant-service";

export const GET = async (req: Request) => {
    try {
        await ServerAuthService.getUser();
        const session = await AzureAIAssistantService.getAuthSession();
        return handleNextSuccess(session)
    } catch (error) {
        console.log("Error in GET:/speech-token", error)
        return handleNextError(error);
    }
}
