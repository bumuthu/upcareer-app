import { egress } from "../../../models/egress";
import { SubscriptionService } from "../../../services/server-side/entity-services/subscription-service";
import { UserService } from "../../../services/server-side/entity-services/user-service";
import { ServerAuthService } from "../../../services/server-side/server-auth-service";
import { handleNextError, handleNextSuccess } from "../../../utils/response-generator";
import { enrichRequest, validateRequiredFields } from "../../../utils/validations";


export const GET = async (req: Request) => {
    try {
        await ServerAuthService.getUser();

        const subscriptionService = new SubscriptionService();
        const res = await subscriptionService.getAll();

        return handleNextSuccess(res)
    } catch (error) {
        console.log("Error in GET:subscription", error)
        return handleNextError(error);
    }
}

export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json();
        validateRequiredFields(requestBody, ["workspaceId", "cycle", "subscriptionKey"]);

        const subscriptionReq: egress.SubscriptionCreateInput = await enrichRequest(requestBody) as egress.SubscriptionCreateInput;
        const userService = new UserService();
        const email = (await userService.getUserByUserId(subscriptionReq.userId!)).email;
        const subscriptionService = new SubscriptionService();
        const clientSecret = await subscriptionService.createCheckout(subscriptionReq, email);

        return handleNextSuccess(clientSecret)
    } catch (error) {
        console.log("Error in POST:subscription", error)
        return handleNextError(error);
    }
}

