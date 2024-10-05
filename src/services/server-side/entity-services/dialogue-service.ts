import DialogueDBModel, { DialogueDocument } from "../../../models/db/dialogue.model";
import { DialogueModel } from "../../../models/entities";
import { EntityService } from "./entity.service";


export class DialogueService extends EntityService<DialogueModel, DialogueDocument> {
    constructor() {
        super(DialogueDBModel);
    }
}
