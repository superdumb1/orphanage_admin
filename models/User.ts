import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  // ✨ Added SAMITY and STAFF to match your sidebar logic
  role: 'ADMIN' | 'SAMITY' | 'STAFF' | 'CAREGIVER' | 'MEDICAL_STAFF' | 'TEACHER';
  phone?: string;
  isActive: boolean;
  lastLogin?: Date; // Useful for auditing who is entering data
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, "Name is required for the registry"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is mandatory for system access"], 
    unique: true,
    lowercase: true, // Prevents "Email@me.com" vs "email@me.com" duplicates
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'SAMITY', 'STAFF', 'CAREGIVER', 'MEDICAL_STAFF', 'TEACHER'], 
    default: 'SAMITY' // Defaulting to the most restricted role for safety
  },
  phone: { type: String },
  isActive: { type: Boolean, default: false },
  lastLogin: { type: Date }, 
}, { timestamps: true });

// // Pre-save hook example (Optional: if you want to track status changes)
// UserSchema.pre('save', function(next) {
//   next();
// });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);