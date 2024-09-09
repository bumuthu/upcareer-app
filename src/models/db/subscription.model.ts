import mongoose, { Document, Schema } from 'mongoose';
import { SubscriptionModel } from '../../models/entities';

export interface SubscriptionDocument extends Document, Omit<SubscriptionModel, '_id'> { }

const subscriptionSchema = new Schema({
    key: String,
    price: Number,
    stripeMonthlyLookUpKey: String,
    stripeAnnualLookUpKey: String,
});

const SubscriptionDBModel = mongoose.models['Subscription'] || mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);

export default SubscriptionDBModel;
