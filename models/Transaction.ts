import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  accountHead: mongoose.Types.ObjectId;
  subTypeSelected: string;
  paymentMethod: 'CASH' | 'BANK' | 'CHEQUE' | 'IN_KIND';
  referenceNumber?: string;
  description: string;
  donorOrVendorName?: string;
  logId?: string; // For linking to inventory logs if this is an inventory-related transaction
}

const TransactionSchema = new Schema({
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },

  accountHead: { type: Schema.Types.ObjectId, ref: 'AccountHead', required: true },
  subTypeSelected: { type: String },
  paymentMethod: { type: String, enum: ['CASH', 'BANK', 'CHEQUE', 'IN_KIND'], default: 'CASH' },
  referenceNumber: { type: String },
  description: { type: String, required: true },
  donorOrVendorName: { type: String },
  logId: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryLog',
    required:false
  },
}, { timestamps: true });

// Always use this pattern for Next.js to prevent model recompilation errors
export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);