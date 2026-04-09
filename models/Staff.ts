import mongoose, { Schema } from "mongoose";

const StaffSchema = new Schema(
  {
    // BASIC INFO
    fullName: { type: String, required: true, trim: true },
    nepaliName: { type: String },

    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },

    address: String,
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    maritalStatus: { type: String, enum: ["SINGLE", "MARRIED"] },
    status: { 
        type: String, 
        enum: ["ACTIVE", "ON_LEAVE", "RESIGNED", "TERMINATED"], 
        default: "ACTIVE" 
    },

    citizenshipNo: String,
    panNumber: String,
    applyTDS: { type: Boolean, default: false },

    // EMPLOYMENT
    designation: String,
    department: String,
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT"],
    },

    joinDate: { type: Date },

    // SALARY (keep structure but REMOVE defaults)
    salary: {
      basicSalary: Number,
      grade: Number,
      dearnessAllowance: Number,

      allowances: {
        houseRent: Number,
        medical: Number,
        transport: Number,
        food: Number,
        communication: Number,
        other: Number,
      },

      festivalBonusMonths: Number,
      insurancePremium: Number,
    },

    // SSF
    ssf: {
      enrolled: Boolean,
      ssfNumber: String,
      employeeContribution: Number,
      employerContribution: Number,
    },

    // BANK
    bank: {
      bankName: String,
      branch: String,
      accountNumber: String,
      accountName: String,
    },

    profileImageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Staff ||
  mongoose.model("Staff", StaffSchema);