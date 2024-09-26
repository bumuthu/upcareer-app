import mongoose, { Document, Schema } from 'mongoose';
import { SystemParameterModel } from '../../models/entities';

export interface SystemParameterDocument extends Document, Omit<SystemParameterModel, '_id'> { }

const systemParameterSchema = new Schema({
    categories: [{
        type: new Schema({
            name: String
        }),
        required: true
    }],
    keywords: [{
        type: new Schema({
            name: String
        }),
        required: true
    }],
    superAdminEmails: [{ type: String }]
});

const SystemParameterDBModel = (mongoose.models || {})['SystemParameter'] || mongoose.model<SystemParameterDocument>('SystemParameter', systemParameterSchema);

export default SystemParameterDBModel;
