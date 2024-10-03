import CategoryDBModel, { CategoryDocument } from "../../../models/db/category.model";
import { CategoryModel } from "../../../models/entities";
import { EntityService } from "./entity.service";


export class CategoryService extends EntityService<CategoryModel, CategoryDocument> {
    constructor() {
        super(CategoryDBModel);
    }

    async getAll() {
        await this.before();
        return this.dbModel.find();
    }
}
