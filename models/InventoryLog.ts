// models/InventoryLog.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryLog extends Document {
  item: mongoose.Types.ObjectId;
  quantity: number;
  type: 'IN' | 'OUT';
  reason: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId; // ✨ NEW: Audit Trail
}

const InventoryLogSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } // ✨ NEW
}, { timestamps: true });

export default mongoose.models.InventoryLog || mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);