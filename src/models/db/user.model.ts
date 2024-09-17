import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from '../../models/entities';

export interface UserDocument extends Document,  Omit<UserModel, '_id'> { }

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    providerUserId: { type: String, required: false },
    status: { type: String, required: true, enum: ["INVITED", "INITIALIZED", "ACTIVE", "DEACTIVE"] },
    notifications: {
        required: false, type: [{
            createdAt: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String, required: false },
            hasRead: { type: Boolean, required: false }
        }]
    },
    resumeUrl: { type: String, required: false },
    createdAt: { type: Number, required: true }
});

const UserDBModel = (mongoose.models || {})['User'] || mongoose.model<UserDocument>('User', userSchema);

export default UserDBModel;
