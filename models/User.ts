import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string; // Storing hashed passwords!
  role: 'ADMIN' | 'CAREGIVER' | 'MEDICAL_STAFF' | 'TEACHER';
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'CAREGIVER', 'MEDICAL_STAFF', 'TEACHER'], 
    default: 'CAREGIVER' 
  },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);