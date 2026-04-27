import mongoose, { Schema, model, models } from "mongoose";

const PayrollSchema = new Schema({
  monthYear: { 
    type: String, 
    required: true, 
    unique: true // 🛡️ Database-level protection against duplicate runs
  },
  disbursementDate: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  staffCount: { type: Number, required: true },
  
  // Financial Links
  bankAccountId: { type: Schema.Types.ObjectId, ref: "PaymentCategory", required: true },
  salaryAccountHeadId: { type: Schema.Types.ObjectId, ref: "AccountHead", required: true },
  transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" }, // Link to Ledger

  // The Snapshot (Critical for historical accuracy)
  details: [{
    staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    staffName: String,
    grossSalary: Number,
    netPaid: Number
  }],

  status: { type: String, enum: ["PROCESSED", "REVERSED"], default: "PROCESSED" },
  remarks: { type: String }
}, { timestamps: true });

export default models.Payroll || model("Payroll", PayrollSchema);