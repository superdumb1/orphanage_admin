import mongoose, { Schema, Document } from 'mongoose';

export interface IActionPlan extends Document {
  childId: mongoose.Types.ObjectId;
  title: string;
  category: 'MEDICAL' | 'EDUCATION' | 'LEGAL' | 'MATERIAL' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  dueDate?: Date;
  assignedStaff?: mongoose.Types.ObjectId;
  estimatedCost?: number;
}

const ActionPlanSchema = new Schema({
  childId: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['MEDICAL', 'EDUCATION', 'LEGAL', 'MATERIAL', 'OTHER'], 
    default: 'OTHER' 
  },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], 
    default: 'MEDIUM' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING' 
  },
  description: { type: String },
  dueDate: { type: Date },
  assignedStaff: { type: Schema.Types.ObjectId, ref: 'Staff' },
  estimatedCost: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.ActionPlan || mongoose.model<IActionPlan>('ActionPlan', ActionPlanSchema);