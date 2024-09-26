import { SystemParameterService } from "../../../../services/server-side/entity-services/system-parameter-service";
import { handleNextError, handleNextSuccess } from "../../../../utils/response-generator";

export const GET = async (req: Request) => {
    try {
        const systemParameterService = new SystemParameterService();
        const res = await systemParameterService.getPublicParams();
        return handleNextSuccess(res)
    } catch (error) {
        console.log("Error in GET:subscription", error)
        return handleNextError(error);
    }
}