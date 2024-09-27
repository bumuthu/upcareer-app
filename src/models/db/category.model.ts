import mongoose, { Document, Schema } from 'mongoose';
import { CategoryModel } from '../../models/entities';

export interface CategoryDocument extends Document, Omit<CategoryModel, '_id'> { }

const categorySchema = new Schema({
    name: { type: String, required: true },
    lookupKey: { type: String, required: true }
});

const CategoryDBModel = (mongoose.models || {})['Category'] || mongoose.model<CategoryDocument>('Category', categorySchema);

export default CategoryDBModel;
