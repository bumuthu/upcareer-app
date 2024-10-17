import { egress } from "@/models/egress";
import { UserService } from "@/services/server-side/entity-services/user-service";
import { handleNextError, handleNextSuccess } from "@/utils/response-generator";
import { enrichRequest, validateRequiredFields } from "@/utils/validations";

export const PUT = async (req: Request) => {
    try{
        const requestBody = await req.json();
        const updatedUser = await enrichRequest(requestBody) as egress.UserUpdateInput

        validateRequiredFields(updatedUser, ['userId']);
        const userService = new UserService();
        const update = {...updatedUser, updatedAt: Date.now()}
        const res = await userService.update(updatedUser.userId!, update)

        return handleNextSuccess(res);

    }
    catch(error){
        console.log("Error in PUT:/user", error)
        return handleNextError(error);
    }
}