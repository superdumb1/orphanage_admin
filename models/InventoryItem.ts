import mongoose, { Schema } from "mongoose";

const InventoryItemSchema = new Schema(
  {
    itemName: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ["GROCERY", "CLOTHING", "EDUCATION", "MEDICAL", "ASSET", "OTHER"]
    },
    unit: { 
        type: String, 
        required: true,
        enum: ["kg", "liters", "pieces", "packets", "boxes", "pairs"]
    },
    
    // THE CURRENT STOCK LEVEL
    currentQuantity: { 
        type: Number, 
        required: true, 
        default: 0,
        min: 0 // Prevents stock from magically becoming negative
    },
    
    // SMART ALERTING
    minQuantityAlert: { 
        type: Number, 
        default: 10,
        // If currentQuantity drops below this number, the dashboard shows a red warning
    },
    
    location: { type: String, default: "Main Storeroom" },
    remarks: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.InventoryItem || mongoose.model("InventoryItem", InventoryItemSchema);