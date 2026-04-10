import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  categoryName: string;
  accountCode?: string;
  categoryType: 'EXPENSE' | 'INCOME' | 'ASSET' | 'LIABILITY';
  description?: string;
}

const CategorySchema: Schema = new Schema({
  categoryName: { type: String, required: true },
  accountCode: { type: String },
  categoryType: { 
    type: String, 
    enum: ['EXPENSE', 'INCOME', 'ASSET', 'LIABILITY'], 
    default: 'EXPENSE' 
  },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);