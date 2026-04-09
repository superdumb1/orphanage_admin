import mongoose, { Schema } from "mongoose";

const InventoryTransactionSchema = new Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem", required: true },
    transactionType: { type: String, enum: ["STOCK_IN", "STOCK_OUT"], required: true },
    quantity: { type: Number, required: true, min: 0.1 },
    date: { type: Date, required: true, default: Date.now },
    purposeOrSource: { type: String, required: true },
    
    // ✨ NEW FIELDS: Tracking how we got it and what it cost ✨
    acquisitionType: { 
        type: String, 
        enum: ["PURCHASED", "DONATED", "CONSUMED", "EXISTING_STOCK"],
        default: "EXISTING_STOCK"
    },
    totalCost: { 
        type: Number, 
        default: 0 // Will be 0 if donated, or the actual price if purchased
    },

    financeTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    recordedBy: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.InventoryTransaction || mongoose.model("InventoryTransaction", InventoryTransactionSchema);