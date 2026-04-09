import mongoose, { Schema, Document } from 'mongoose';

export interface IChild extends Document {
  firstName: string; 
  lastName: string;
  dateOfBirth: Date; 
  admissionDate: Date;
  gender: string; 
  status: 'IN_CARE' | 'FOSTERED' | 'ADOPTED' | 'REUNITED' | 'GRADUATED';
  profileImageUrl?: string;
  gallery: string[];     // Photo Gallery
  documents: string[];   // Legal/Medical Vault
  bloodType?: string; 
  allergies?: string;
  schoolName?: string; 
  gradeLevel?: string;
  arrivalCategory: string; 
  arrivalDetails?: string;
  medicalNotes?: string;
}

const ChildSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  admissionDate: { type: Date, default: Date.now },
  gender: { type: String, required: true },
  
  // Strict status tracking
  status: { 
      type: String, 
      enum: ['IN_CARE', 'FOSTERED', 'ADOPTED', 'REUNITED', 'GRADUATED'], 
      default: 'IN_CARE' 
  },
  
  // Media & Docs
  profileImageUrl: { type: String },
  gallery: [{ type: String }],
  documents: [{ type: String }],
  
  // Medical & Background
  bloodType: { type: String },
  allergies: { type: String },
  schoolName: { type: String },
  gradeLevel: { type: String },
  arrivalCategory: { type: String, default: 'OTHER' },
  arrivalDetails: { type: String },
  medicalNotes: { type: String }
}, { timestamps: true });

export default mongoose.models.Child || mongoose.model<IChild>('Child', ChildSchema);