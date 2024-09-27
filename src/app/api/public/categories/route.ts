import { CategoryService } from "../../../../services/server-side/entity-services/category-service";
import { handleNextError, handleNextSuccess } from "../../../../utils/response-generator";

export const GET = async (req: Request) => {
    try {
        const categoryService = new CategoryService();
        const res = await categoryService.getAll();
        return handleNextSuccess(res)
    } catch (error) {
        console.log("Error in GET:public/categories", error)
        return handleNextError(error);
    }
}