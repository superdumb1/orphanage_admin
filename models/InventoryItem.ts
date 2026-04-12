import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  category: 'FOOD' | 'CLOTHING' | 'EDUCATION' | 'MEDICAL' | 'MAINTENANCE';
  unit: string; // e.g., 'kg', 'liters', 'pieces', 'pairs'
  currentStock: number;
  minimumStockLevel: number; // To trigger low-stock alerts!
}

const InventoryItemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['FOOD', 'CLOTHING', 'EDUCATION', 'MEDICAL', 'MAINTENANCE'], 
    required: true 
  },
  unit: { type: String, required: true },
  currentStock: { type: Number, default: 0, required: true }, // Always starts at 0
  minimumStockLevel: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.models.InventoryItem || mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);