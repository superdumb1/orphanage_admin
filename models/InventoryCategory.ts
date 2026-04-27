import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryCategory extends Document {
  name: string;
  type: "CONSUMABLE" | "ASSET"; // ✨ The differentiator
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

const InventoryCategorySchema = new Schema<IInventoryCategory>(
  {
    name: { 
      type: String, 
      required: [true, "Category name is required"], 
      trim: true 
    },
    type: { 
      type: String, 
      enum: ["CONSUMABLE", "ASSET"], 
      required: true 
    },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure a category name is unique within its own type
InventoryCategorySchema.index({ name: 1, type: 1 }, { unique: true });

const InventoryCategory: Model<IInventoryCategory> = 
  mongoose.models.InventoryCategory || mongoose.model<IInventoryCategory>("InventoryCategory", InventoryCategorySchema);

export default InventoryCategory;