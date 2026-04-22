"use server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";

export async function settleStaffCash(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    
    const staffId = formData.get("staffId") as string;
    const bankAccountId = formData.get("bankAccountId") as string;
    const totalAmount = Number(formData.get("totalAmount"));

    if (!staffId || !bankAccountId || totalAmount <= 0) {
      return { error: "Missing required settlement parameters." };
    }

    // 1. Mark all their verified cash as SETTLED
    await Transaction.updateMany(
      { 
        createdBy: staffId, 
        paymentMethod: "CASH", 
        status: "VERIFIED", 
        isSettled: false,
        type: "INCOME" // Only settling the cash they brought IN
      },
      { $set: { isSettled: true } }
    );

    // 2. Create the Official Bank Deposit Transaction
    await Transaction.create({
      amount: totalAmount,
      type: "INCOME",
      paymentMethod: "BANK",
      accountHead: bankAccountId, 
      status: "VERIFIED",
      isSettled: true, // It's already in the bank
      description: `[SYSTEM SETTLEMENT] Bulk cash deposit from Staff/Samity member.`,
      createdBy: staffId // Keep the audit trail of whose cash this was
    });

    revalidatePath("/finance");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Settlement Protocol Failed." };
  }
}