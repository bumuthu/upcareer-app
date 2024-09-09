import { KindeAuthService } from "../../../../services/kinde-auth-service";
import { handleNextError, handleNextSuccess } from "../../../../utils/response-generator";


export const POST = async (req: Request) => {
    try {
        const token = await req.text();

        const kindeService = new KindeAuthService();
        await kindeService.handleWebhook(token);
        return handleNextSuccess({ message: "Success" })
    } catch (err) {
        return handleNextError(err);
    }
}