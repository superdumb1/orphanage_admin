import mongoose, { Schema, Document } from 'mongoose';

export interface IDonor extends Document {
  name: string;
  email?: string;
  phone?: string;
  panNumber?: string; // Important for tax receipts in Nepal
  totalDonatedAmount: number; // Cached total for easy querying
  donorType: 'INDIVIDUAL' | 'ORGANIZATION';
}

const DonorSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  panNumber: { type: String },
  totalDonatedAmount: { type: Number, default: 0 },
  donorType: { type: String, enum: ['INDIVIDUAL', 'ORGANIZATION'], default: 'INDIVIDUAL' }
}, { timestamps: true });

export default mongoose.models.Donor || mongoose.model<IDonor>('Donor', DonorSchema);