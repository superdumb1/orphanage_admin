import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    // CORE DETAILS
    type: { 
        type: String, 
        enum: ["INCOME", "EXPENSE"], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    date: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    
    // CATEGORIZATION
    category: { 
        type: String, 
        required: true,
        // e.g., 'DONATION', 'GRANT', 'GROCERY', 'MEDICAL', 'UTILITIES', 'PAYROLL'
    },
    paymentMethod: { 
        type: String, 
        enum: ["CASH", "BANK", "KIND"], // "KIND" is for physical goods like rice/clothes
        required: true 
    },
    
    // DONATION SPECIFICS (Only used if type === 'INCOME')
    donorName: { type: String },
    donorPhone: { type: String },
    isAnonymous: { type: Boolean, default: false },
    
    // IN-KIND SPECIFICS (Only used if paymentMethod === 'KIND')
    itemDescription: { type: String }, // e.g., "50kg Jeera Masino Rice, 5 liters Oil"
    
    // GENERAL
    remarks: { type: String },
    receiptNumber: { type: String, unique: true, sparse: true }, // For official tax receipts
    
    // AUDIT TRAIL
    recordedBy: { type: String }, // Who entered this into the system
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);