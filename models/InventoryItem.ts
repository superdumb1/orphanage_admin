import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  category: 'FOOD' | 'CLOTHING' | 'EDUCATION' | 'MEDICAL' | 'MAINTENANCE';
  unit: string; // e.g., 'kg', 'liters', 'pieces', 'pairs'
  currentStock: number;
  minimumStockLevel: number; // To trigger low-stock alerts!
  
  description?: string; // ✨ Helpful for brand names or specifics
  isActive: boolean;    // ✨ Allows you to hide discontinued items safely
}

const InventoryItemSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { 
    type: String, 
    enum: ['FOOD', 'CLOTHING', 'EDUCATION', 'MEDICAL', 'MAINTENANCE'], 
    required: true 
  },
  unit: { type: String, required: true, trim: true },
  currentStock: { type: Number, default: 0, required: true },
  minimumStockLevel: { type: Number, default: 10 },
  
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.InventoryItem || mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);