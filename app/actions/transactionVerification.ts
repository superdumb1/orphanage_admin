"use server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth/next";
// Note: Import your authOptions from wherever you defined them
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function verifyTransaction(transactionId: string) {
  try {
    await dbConnect();
    
    // 1. Security Check (Uncomment when you have authOptions imported)
    // const session = await getServerSession(authOptions);
    // if (session?.user?.role !== "ADMIN") {
    //   throw new Error("Security Violation: Only Administrators can verify transactions.");
    // }

    // 2. Perform the Verification
    const updatedTx = await Transaction.findByIdAndUpdate(
      transactionId,
      { 
        status: "VERIFIED",
        // verifiedBy: session?.user?.id // Log who approved it
      },
      { new: true }
    );

    if (!updatedTx) throw new Error("Transaction not found.");

    // 3. Revalidate the UI
    revalidatePath("/approvals");
    revalidatePath("/finance"); // Updates the main ledger

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectTransaction(transactionId: string, reason: string) {
    try {
      await dbConnect();
      // Add Admin check here too
      
      await Transaction.findByIdAndUpdate(transactionId, { 
          status: "REJECTED",
          description: `[REJECTED] - ${reason}` // Append the reason to the description
      });
  
      revalidatePath("/approvals");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }