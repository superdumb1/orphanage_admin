"use server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";

export async function addTransaction(prevState: any, formData: FormData) {
    await dbConnect();
    console.log(formData)

    try {
        await Transaction.create({
            amount: Number(formData.get("amount")),
            date: formData.get("date") || new Date(),
            type: formData.get("type"), 
            accountHead: formData.get("accountHead"), 
            subTypeSelected: formData.get("subTypeSelected"), 
            paymentMethod: formData.get("paymentMethod"),
            referenceNumber: formData.get("referenceNumber"),
            description: formData.get("description"),
            donorOrVendorName: formData.get("donorOrVendorName"),
        });
        
        // Revalidate the ledger/finance page to show the new data instantly
        revalidatePath("/finance"); 
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTransaction(id: string) {
    await dbConnect();
    try {
        await Transaction.findByIdAndDelete(id);
        revalidatePath("/finance");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateTransaction(id: string, formData: FormData) {
    await dbConnect();
    try {
        const updateData = {
            amount: Number(formData.get("amount")),
            type: formData.get("type"),
            accountHead: formData.get("accountHead"),
            description: formData.get("description"),
            paymentMethod: formData.get("paymentMethod"),
        };
        await Transaction.findByIdAndUpdate(id, updateData);
        revalidatePath("/finance");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}