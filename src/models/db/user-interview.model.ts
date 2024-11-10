import mongoose, { Document, Schema } from 'mongoose';
import { UserInterviewModel } from '../../models/entities';

export interface UserInterviewDocument extends Document, Omit<UserInterviewModel, '_id'> { }

const userInterviewSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    baseInterview: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BaseInterview' },
    jobDescription: { type: String, required: false },
    interviewScores: { type: Object, required: false }, // TODO: Add type
    status:{ type: String, required: true, enum: ["INITIALIZED","ONGOING", "COMPLETED", "CANCELLED"] },
    startedAt: { type: Number, required: false },
    endingReason: {type: String, required: false, enum: ["TIMEOUT", "USER_CANCELLED", "COMPLETED"]}, 
    endedAt: { type: Number, required: false },
    nodes: { type: Object, required: false },
    currentNodeId: { type: String, required: false },
    threadId: { type: String, required: false },
    mode: {type: String, required: false, enum: ["LEARNING", "WARMUP"]}, 
    difficulty: {type: String, required: false, enum: ["INTERMEDIATE", "ADVANCED"]}, 
});

const UserInterviewDBModel = (mongoose.models || {})['UserInterview'] || mongoose.model<UserInterviewDocument>('UserInterview', userInterviewSchema);

export default UserInterviewDBModel;
