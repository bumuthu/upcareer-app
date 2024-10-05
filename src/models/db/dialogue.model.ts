import mongoose, { Document, Schema } from 'mongoose';
import { DialogueModel } from '../entities';

export interface DialogueDocument extends Document, Omit<DialogueModel, '_id'> { }

const dialogueSchema = new Schema({
    text: { type: String, required: false },
    userInterview: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserInterview' },
    parentDialogue: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Dialogue' },
    askedBy: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    askedByAI: { type: Boolean, required: false },
    feedback: {
        required: false, type: {
            score: { type: Number, required: true },
            feedback: { type: String, required: true }
        }
    },
    createdAt: { type: Number, required: true }
});

const DialogueDBModel = (mongoose.models || {})['Dialogue'] || mongoose.model<DialogueDocument>('Dialogue', dialogueSchema);

export default DialogueDBModel;
