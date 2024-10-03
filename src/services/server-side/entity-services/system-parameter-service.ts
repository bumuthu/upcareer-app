import SystemParameterDBModel, { SystemParameterDocument } from "../../../models/db/system-parameter.model";
import { SystemParameterModel } from "../../../models/entities";
import { EntityService } from "./entity.service";


export class SystemParameterService extends EntityService<SystemParameterModel, SystemParameterDocument> {
    constructor() {
        super(SystemParameterDBModel);
    }

    async getPublicParams() {
        await this.before();
        const res = await this.dbModel.find({}, "categories keywords");
        return res[0];
    }
}
