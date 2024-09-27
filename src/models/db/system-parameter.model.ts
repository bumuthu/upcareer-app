import mongoose, { Document, Schema } from 'mongoose';
import { SystemParameterModel } from '../../models/entities';

export interface SystemParameterDocument extends Document, Omit<SystemParameterModel, '_id'> { }

const systemParameterSchema = new Schema({
    superAdminEmails: [{ type: String }]
});

const SystemParameterDBModel = (mongoose.models || {})['SystemParameter'] || mongoose.model<SystemParameterDocument>('SystemParameter', systemParameterSchema);

export default SystemParameterDBModel;
