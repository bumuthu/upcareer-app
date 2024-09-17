import mongoose, { Document, Schema } from 'mongoose';
import { SubscriptionModel } from '../../models/entities';

export interface SubscriptionDocument extends Document, Omit<SubscriptionModel, '_id'> { }

const subscriptionSchema = new Schema({
    key: { type: String, required: true, enum: ["FREE", "PLUS", "PREMIUM"] },
    price: { type: Number, required: true },
    stripeMonthlyLookUpKey: { type: String, required: true }
});

const SubscriptionDBModel = (mongoose.models || {})['Subscription'] || mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);

export default SubscriptionDBModel;
