import mongoose from "mongoose";
import AccountHead from "@/models/AccountHead";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function seedDefaults() {
  try {
    // Check if the fallback account already exists
    const existing = await AccountHead.findOne({ code: "EXP-STAFF" });

    if (!existing) {
      await AccountHead.create({
        name: "Staff/Samity Personal Cash Spend",
        type: "EXPENSE",
        fundCategory: "UNRESTRICTED",
        code: "EXP-STAFF",
        description: "Auto-generated default account for staff out-of-pocket or unclassified cash purchases.",
        isSystem: true, // Indestructible
        isActive: true,
      });
      console.log("🌱 [System] Auto-seeded Staff Fallback Account (EXP-STAFF)");
    }
  } catch (error) {
    console.error("⚠️ [System] Failed to seed default accounts:", error);
  }
}
export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }
  
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  await seedDefaults();

  return cached.conn;
}