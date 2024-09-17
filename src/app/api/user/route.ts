import { AuthService } from "../../../services/auth-service";
import { UserService } from "../../../services/entity-services/user-service";
import { handleNextError, handleNextSuccess } from "../../../utils/response-generator";

export const GET = async (req: Request) => {
    try {
        const authUser = await AuthService.getUser();
        const userService = new UserService();
        const user = await userService.getUserByEmail(authUser.email);
        return handleNextSuccess(user)
    } catch (error) {
        console.log("Error in GET:/user", error)
        return handleNextError(error);
    }
}

