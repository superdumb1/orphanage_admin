import mongoose, { Schema, Document } from 'mongoose';

export interface IGuardian extends Document {
  primaryName: string;
  secondaryName?: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  annualIncome?: number;
  type: 'FOSTER_PARENT' | 'ADOPTIVE_PARENT' | 'SPONSOR';
  backgroundCheckStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  documents: string[]; // Vault for IDs, Background Checks, Tax returns
  childrenAssigned: mongoose.Types.ObjectId[]; 
}

const GuardianSchema: Schema = new Schema({
  primaryName: { type: String, required: true },
  secondaryName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  
  // Real-world vetting fields
  occupation: { type: String },
  annualIncome: { type: Number },
  
  type: { 
      type: String, 
      enum: ['FOSTER_PARENT', 'ADOPTIVE_PARENT', 'SPONSOR'], 
      required: true 
  },
  backgroundCheckStatus: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  
  // The Document Vault
  documents: [{ type: String }],
  
  childrenAssigned: [{ type: Schema.Types.ObjectId, ref: 'Child' }]
}, { timestamps: true });

export default mongoose.models.Guardian || mongoose.model<IGuardian>('Guardian', GuardianSchema);