import mongoose from "mongoose";
import AccountHead from "@/models/AccountHead";
import PaymentCategory from "@/models/paymentCategory"; // ✨ NEW

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function seedDefaults() {
  try {
    // 1. Seed System Account Heads (The "What" - Chart of Accounts)
    const defaultHeads = [
      {
        name: "Staff Personal Expense",
        type: "EXPENSE",
        fundCategory: "UNRESTRICTED",
        code: "EXP-STAFF",
        description: "Standard account for staff out-of-pocket purchases.",
        isSystem: true,
      },
      {
        name: "General Donations",
        type: "INCOME",
        fundCategory: "UNRESTRICTED",
        code: "INC-GEN",
        description: "Default account for incoming unrestricted funds.",
        isSystem: true,
      }
    ];

    for (const head of defaultHeads) {
      await AccountHead.updateOne(
        { code: head.code },
        { $setOnInsert: head },
        { upsert: true }
      );
    }

    // 2. Seed System Payment Categories (The "Where" - Cash/Bank/Staff)
    // Inside seedDefaults() function...

    // 2. Seed System Payment Categories
    const defaultCategories = [
      {
        name: "Main Office Cash",
        identifier: "OFFICE_CASH", // ✨ Added unique identifier
        type: "CASH",
        isActive: true,
        isSystem: true,
      },
      {
        name: "Staff Wallet (Reimbursable)",
        identifier: "STAFF_WALLET", // ✨ Added unique identifier
        type: "PERSONAL",
        isActive: true,
        isSystem: true,
      },
      {
        name: "General Bank Account",
        identifier: "GEN_BANK", // ✨ Added unique identifier
        type: "BANK",
        isActive: true,
        isSystem: false,
      }
    ];

    for (const cat of defaultCategories) {
      await PaymentCategory.updateOne(
        { identifier: cat.identifier }, // 👈 Search by the unique identifier now
        { $setOnInsert: cat },
        { upsert: true }
      );
    }
    console.log("🌱 [System] Database hydration complete (Accounts & Categories)");

  } catch (error) {
    console.error("⚠️ [System] Seed error:", error);
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

  // Running seed logic after connection is established
  await seedDefaults();

  return cached.conn;
}