"use server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTransaction(prevState: any, formData: FormData) {
    await dbConnect();
    const raw = Object.fromEntries(formData.entries());

    const payload = {
        ...raw,
        amount: Number(raw.amount),
        isAnonymous: raw.isAnonymous === "on", 
        date: raw.date ? new Date(raw.date as string) : new Date(),
    };

    try {
        await Transaction.create(payload);
    } catch (error: any) {
        console.error("Transaction Error:", error);
        return { error: "Failed to save transaction: " + error.message };
    }

    revalidatePath("/finance");
    redirect("/finance");
}