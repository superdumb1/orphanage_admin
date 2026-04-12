import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryLog extends Document {
  item: mongoose.Types.ObjectId;
  quantity: number;
  type: 'IN' | 'OUT';
  reason: string; // e.g., "Daily meals", "Donation from John"
  date: Date;
}

const InventoryLogSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.InventoryLog || mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);