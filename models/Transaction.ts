import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  accountHead?: mongoose.Types.ObjectId | null;
  subType?: string; // ✨ ALIGNED: Changed from subTypeSelected to match your UI/Action
  
  paymentMethod: 'CASH' | 'BANK' | 'CHEQUE' | 'IN_KIND' | 'OUT_OF_POCKET';
  
  // ✨ NEW: The crucial link to the specific Bank Account
  bankAccountId?: mongoose.Types.ObjectId | null; 
  
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isSettled: boolean; // ✨ Added to interface for TypeScript safety
  createdBy: mongoose.Types.ObjectId;
  verifiedBy?: mongoose.Types.ObjectId;
  referenceNumber?: string;
  description: string;
  donorOrVendorName?: string;
  logId?: mongoose.Types.ObjectId | string;
}

const TransactionSchema = new Schema({
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },

  accountHead: {
    type: Schema.Types.ObjectId,
    ref: 'AccountHead',
    required: false,
    default: null
  }, 
  
  subType: { type: String }, // ✨ ALIGNED to match the form input
  
  paymentMethod: {
    type: String,
    enum: ['CASH', 'BANK', 'CHEQUE', 'IN_KIND', 'OUT_OF_POCKET'],
    default: 'CASH'
  }, 
  
  // ✨ NEW: Tells Mongoose to accept and store the Bank Account ID safely
  bankAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'AccountHead',
    required: false,
    default: null 
  },
  
  referenceNumber: { type: String },
  description: { type: String, required: true },
  donorOrVendorName: { type: String },
  
  logId: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryLog',
    required: false
  },
  status: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isSettled: {
    type: Boolean,
    default: false 
  },
}, { timestamps: true });

// Always use this pattern for Next.js to prevent model recompilation errors
export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);