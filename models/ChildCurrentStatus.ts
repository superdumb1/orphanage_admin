import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChildStatus extends Document {
  name: string;
  isActive: boolean;
}

const ChildStatusSchema = new Schema<IChildStatus>({
  name: { type: String, required: true, unique: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.ChildStatus || mongoose.model<IChildStatus>("ChildStatus", ChildStatusSchema);