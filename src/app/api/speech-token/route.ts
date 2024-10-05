import { ServerAuthService } from "../../../services/server-side/server-auth-service";
import { handleNextError, handleNextSuccess } from "../../../utils/response-generator";
import { AzureAIServerService } from "../../../services/server-side/azure-ai-server-service";

export const GET = async (req: Request) => {
    try {
        await ServerAuthService.getUser();
        const azureService = new AzureAIServerService();
        const session = await azureService.getAuthSession();
        return handleNextSuccess(session)
    } catch (error) {
        console.log("Error in GET:/speech-token", error)
        return handleNextError(error);
    }
}
