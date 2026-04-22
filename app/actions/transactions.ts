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

    const id = formData.get("id"); // Hidden field determines if it's an Edit
    
    // Core Data
    const amount = Number(formData.get("amount"));
    const type = formData.get("type");
    const accountHead = formData.get("accountHead");
    const subTypeSelected = formData.get("subType") || formData.get("subTypeSelected") || "";
    const paymentMethod = formData.get("paymentMethod");
    const date = formData.get("date") || new Date();
    const referenceNumber = formData.get("referenceNumber") || "";
    const description = formData.get("description");
    const donorOrVendorName = formData.get("donorOrVendorName") || "";
    
    // RBAC & Verification Protocol Data
    const createdBy = formData.get("createdBy");
    const status = formData.get("status");

    if (!amount || amount <= 0) return { error: "Amount must be greater than zero." };
    if (!accountHead || !description) return { error: "Missing required fields." };

    if (id) {
      // UPDATE EXISTING
      await Transaction.findByIdAndUpdate(id, {
        amount, type, accountHead, subTypeSelected, paymentMethod,
        date, referenceNumber, description, donorOrVendorName
      });
    } else {
      // CREATE NEW
      if (!createdBy) return { error: "System Error: Missing user session for creation." };
      
      await Transaction.create({
        amount, type, accountHead, subTypeSelected, paymentMethod,
        date, referenceNumber, description, donorOrVendorName,
        status, createdBy
      });
    }

    revalidatePath("/finance"); 
    return { success: true, error: null };

  } catch (error: any) {
    console.error("Transaction Action Error:", error);
    return { error: error.message || "Failed to process transaction." };
  }
}

// ============================================================================
// 2. DELETE PROTOCOL
// ============================================================================
export async function deleteTransaction(id: string) {
    await dbConnect();
    try {
        await Transaction.findByIdAndDelete(id);
        
        revalidatePath("/finance");
        return { success: true };
    } catch (e: any) {
        console.error("Delete Error:", e);
        return { success: false, error: e.message };
    }
}

// ============================================================================
// 3. LEGACY UPDATE PROTOCOL (Kept intact for your other components)
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
        
        revalidatePath("/finance");
        return { success: true };
    } catch (e: any) {
        console.error("Update Error:", e);
        return { success: false, error: e.message };
    }
}