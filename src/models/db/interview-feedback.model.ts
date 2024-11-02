import mongoose, { Document, Schema } from "mongoose";
import { UserFeedbackModel } from "../entities";

export interface UserFeedbackDocument extends Document, Omit<UserFeedbackModel, '_id'>{}

const userFeedbackSchema = new Schema({
    userInterview: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserInterview'},
    baseInterview: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'BaseInterview'},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    rating: {type: Number, required: true},
    comment: {type: String, required: false},
})
const UserFeedbackDBModel = (mongoose.models || {})['UserFeedback'] || mongoose.model<UserFeedbackDocument>('UserFeedback', userFeedbackSchema);

export default UserFeedbackDBModel;