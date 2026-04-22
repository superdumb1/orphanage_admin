"use server";

import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";

// ============================================================================
// 1. MAIN ADD / UPSERT PROTOCOL (Handles the TransactionForm component)
// ============================================================================
export async function addTransaction(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    // 1. Extract values
    const id = formData.get("id") as string; // ✨ Catches the hidden ID for updates
    const rawAccountHead = formData.get("accountHead") as string;
    const rawBankAccountId = formData.get("bankAccountId") as string; // ✨ Catches the new Bank ID
    
    const amount = formData.get("amount");
    const createdBy = formData.get("createdBy");

    // 2. Format Object IDs (Convert empty strings to null to prevent BSON errors)
    const accountHead = rawAccountHead === "" ? null : rawAccountHead;
    const bankAccountId = rawBankAccountId === "" ? null : rawBankAccountId;

    // 3. Build the Universal Payload
    const payload = {
      amount: Number(amount),
      type: formData.get("type"),
      accountHead: accountHead,
      subType: formData.get("subType"),
      paymentMethod: formData.get("paymentMethod"),
      bankAccountId: bankAccountId, // ✨ SAVING THE BANK ID
      date: formData.get("date") ? new Date(formData.get("date") as string) : new Date(),
      description: formData.get("description"),
      donorOrVendorName: formData.get("donorOrVendorName"),
      referenceNumber: formData.get("referenceNumber"),
      status: formData.get("status") || "PENDING",
      createdBy: createdBy,
    };

    // 4. Upsert Logic (Update if ID exists, otherwise Create)
    if (id) {
      await Transaction.findByIdAndUpdate(id, payload, { runValidators: true });
    } else {
      await Transaction.create(payload);
    }

    // Revalidate your dashboards
    revalidatePath("/my-finances");
    revalidatePath("/finances"); 
    revalidatePath("/settlements"); // ✨ Good idea to refresh settlements too!

    return { success: true, error: null };

  } catch (error: any) {
    console.error("Transaction Action Error:", error);

    return {
      success: false,
      error: error.name === "ValidationError"
        ? "Please check your input fields."
        : "Database Error: " + error.message
    };
  }
}

// ============================================================================
// 2. DELETE PROTOCOL
// ============================================================================
export async function deleteTransaction(id: string) {
  await dbConnect();
  try {
    await Transaction.findByIdAndDelete(id);

    revalidatePath("/finances");
    revalidatePath("/my-finances");
    return { success: true };
  } catch (e: any) {
    console.error("Delete Error:", e);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// 3. LEGACY UPDATE PROTOCOL 
// ============================================================================
export async function updateTransaction(id: string, formData: FormData) {
  await dbConnect();
  try {
    const updateData = {
      amount: Number(formData.get("amount")),
      type: formData.get("type"),
      accountHead: formData.get("accountHead"),
      subTypeSelected: formData.get("subTypeSelected"),
      description: formData.get("description"),
      paymentMethod: formData.get("paymentMethod"),
      referenceNumber: formData.get("referenceNumber"),
      donorOrVendorName: formData.get("donorOrVendorName"),
    };

    await Transaction.findByIdAndUpdate(id, updateData);

    revalidatePath("/finances");
    return { success: true };
  } catch (e: any) {
    console.error("Update Error:", e);
    return { success: false, error: e.message };
  }
}