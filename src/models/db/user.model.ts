import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from '../../models/entities';

export interface UserDocument extends Document, Omit<UserModel, '_id'> { }

const userSchema = new Schema({
    name: String,
    email: String,
    providerUserId: String,
    status: String,
    notifications: [{
        createdAt: Number,
        title: String,
        description: String,
        hasRead: Boolean
    }],
    imageUrl: String,
    thumbnailUrl: String,
    createdAt: Number,
});

const UserDBModel = mongoose.models['User'] || mongoose.model<UserDocument>('User', userSchema);

export default UserDBModel;
