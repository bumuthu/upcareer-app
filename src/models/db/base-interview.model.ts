import mongoose, { Document, Schema } from 'mongoose';
import { BaseInterviewModel, SubscriptionModel } from '../../models/entities';

export interface BaseInterviewDocument extends Document, Omit<BaseInterviewModel, '_id'> { }

const baseInterviewSchema = new Schema({
    title: { type: String, required: true, },
    jobDescription: { type: String, required: true },
    stripeMonthlyLookUpKey: { type: String, required: true },
    saves: { type: Number, required: false },
    uses: { type: Number, required: false },
    rating: { type: Number, required: false }
});

const BaseInterviewDBModel = mongoose.models['BaseInterview'] || mongoose.model<BaseInterviewDocument>('BaseInterview', baseInterviewSchema);

export default BaseInterviewDBModel;
