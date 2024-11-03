import { egress } from "@/models/egress";
import { UserInterviewService } from "@/services/server-side/entity-services/user-interview-service";
import { handleNextError, handleNextSuccess } from "@/utils/response-generator";
import { enrichRequest, validateRequiredFields } from "@/utils/validations";

export const GET = async (req: Request) => {
  try {
    const splits = req.url.split("/");
    const userInterviewId = splits[splits.length - 1];

    const userInterviewService = new UserInterviewService();
    const baseInterview = await userInterviewService.get(userInterviewId, "baseInterview");
    return handleNextSuccess(baseInterview);
  } catch (error) {
    console.log("Error in GET:/interview/:id", error);
    return handleNextError(error);
  }
};

export const PUT = async (req: Request) => {
  try {
      const requestBody = await req.json();
      const updateUserInterview = await enrichRequest(requestBody) as egress.UserInterviewUpdateInput;

      validateRequiredFields(updateUserInterview, ["userInterviewId"]);

      const userInterviewService = new UserInterviewService()
      const update: any = { ...updateUserInterview, updatedAt: Date.now() }
      const res = await userInterviewService.update(updateUserInterview.userInterviewId, update)

      return handleNextSuccess(res)
  }
  catch (error) {
      console.log("Error in PUT:userInterview", error)
      handleNextError(error)
  }
}