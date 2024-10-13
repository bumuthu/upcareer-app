import { egress } from "@/models/egress";
import { UserInterviewService } from "@/services/server-side/entity-services/user-interview-service";
import { handleNextError, handleNextSuccess } from "@/utils/response-generator";
import { enrichRequest, validateRequiredFields } from "@/utils/validations";

export const GET = async (req: Request) => {
    try {
      
      const enrichedReqBody = await enrichRequest(req as any) as egress.UserInterviewsQueryInput;
      validateRequiredFields(enrichedReqBody,['userId'])
      const userInterviewService = new UserInterviewService();
      const userInterviews = await userInterviewService.getUserInterviews({userId: enrichedReqBody.userId});
      return handleNextSuccess(userInterviews);
    } catch (error) {
      console.log("Error in GET:/UserInterviews", error);
      return handleNextError(error);
    }
  };