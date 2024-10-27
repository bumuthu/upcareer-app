import mongoose, { Document, Schema } from 'mongoose';
import { BaseInterviewModel } from '../../models/entities';

export interface BaseInterviewDocument extends Document, Omit<BaseInterviewModel, '_id'> { }

const baseInterviewSchema = new Schema({
    title: { type: String, required: true, },
    lookupKey: { type: String, required: true },
    jobDescription: { type: String, required: true },
    aboutInterview: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category'  },
    keywords: {
        type: [String],
        required: true
    },
    saves: { type: Number, required: false },
    uses: { type: Number, required: false },
    rating: { type: Number, required: false },
    openAIAssistantId: { type: String, required: true }
});

const BaseInterviewDBModel = (mongoose.models || {})['BaseInterview'] || mongoose.model<BaseInterviewDocument>('BaseInterview', baseInterviewSchema);

export default BaseInterviewDBModel;
