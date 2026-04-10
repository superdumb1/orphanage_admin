import mongoose, { Schema, Document } from 'mongoose';

export interface IGuardian extends Document {
  primaryName: string;
  secondaryName?: string; // Spouse/Partner
  relationshipStatus: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  annualIncome: number;
  type: 'FOSTER' | 'ADOPTIVE' | 'SPONSOR';
  vettingStatus: 'INQUIRY' | 'VETTING' | 'APPROVED' | 'REJECTED' | 'BLACKLISTED';
  backgroundCheckDocs: string[]; // Links to Cloudinary (Police report, ID copies)
  homeVisitNotes: string[];
  assignedChildren: mongoose.Types.ObjectId[];
}

const GuardianSchema = new Schema({
  primaryName: { type: String, required: true },
  secondaryName: { type: String },
  relationshipStatus: { type: String, default: 'MARRIED' },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  occupation: { type: String },
  annualIncome: { type: Number, default: 0 },
  type: { 
    type: String, 
    enum: ['FOSTER', 'ADOPTIVE', 'SPONSOR'], 
    required: true 
  },
  vettingStatus: { 
    type: String, 
    enum: ['INQUIRY', 'VETTING', 'APPROVED', 'REJECTED', 'BLACKLISTED'], 
    default: 'INQUIRY' 
  },
  backgroundCheckDocs: [{ type: String }],
  homeVisitNotes: [{ type: String }],
  assignedChildren: [{ type: Schema.Types.ObjectId, ref: 'Child' }]
}, { timestamps: true });

export default mongoose.models.Guardian || mongoose.model<IGuardian>('Guardian', GuardianSchema);