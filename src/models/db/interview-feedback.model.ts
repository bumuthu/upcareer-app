import mongoose, { Document, Schema } from "mongoose";
import { InterviewFeedbackModel } from "../entities";

export interface InterviewFeedbackDocument extends Document, Omit<InterviewFeedbackModel, '_id'>{}

const interviewFeedbackSchema = new Schema({
    userInterview: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserInterview'},
    baseInterview: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'BaseInterview'},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    rating: {type: Number, required: true},
    comment: {type: String, required: false},
})
const UserFeedbackDBModel = (mongoose.models || {})['UserFeedback'] || mongoose.model<InterviewFeedbackDocument>('UserFeedback', interviewFeedbackSchema);

export default UserFeedbackDBModel;