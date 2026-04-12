import mongoose, { Schema, Document } from 'mongoose';

export interface IAccountHead extends Document {
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'ASSET' | 'LIABILITY' | 'EQUITY';
  subType: string; // e.g., 'Restricted', 'Living', 'Fixed Asset'
  description?: string;
  isSystem: boolean; // Protects core accounts from deletion
  code: string; // e.g., 1000 for Income, 2000 for Expenses
}

const AccountHeadSchema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['INCOME', 'EXPENSE', 'ASSET', 'LIABILITY'], 
    required: true 
  },
  fundCategory: { 
    type: String, 
    enum: ['RESTRICTED', 'UNRESTRICTED'], 
    default: 'UNRESTRICTED',
    required: true 
  },
  subType: [{ type: String }], // Keeping this for categories like "Living", "Education"
  code: { type: String, unique: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.AccountHead || mongoose.model<IAccountHead>('AccountHead', AccountHeadSchema);