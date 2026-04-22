"use server";

import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import AccountHead from "@/models/AccountHead";
import { revalidatePath } from "next/cache";

export async function executeTransfer(prevState: any, formData: FormData) {
    await dbConnect();

    try {
        const amount = Number(formData.get("amount"));
        const fromAccountId = formData.get("fromAccount") as string;
        const toAccountId = formData.get("toAccount") as string;
        const date = formData.get("date") ? new Date(formData.get("date") as string) : new Date();
        const description = formData.get("description") as string;
        
        const createdBy = formData.get("createdBy") as string;
        const status = formData.get("status") as string || "PENDING";

        if (!createdBy) throw new Error("Security Violation: User session not found.");
        if (amount <= 0) throw new Error("Transfer amount must be greater than zero.");
        if (fromAccountId === toAccountId) throw new Error("Cannot transfer to the same account.");

        // 1. Get account details so we can write clean descriptions
        const fromAccount = await AccountHead.findById(fromAccountId);
        const toAccount = await AccountHead.findById(toAccountId);

        if (!fromAccount || !toAccount) throw new Error("One or both accounts could not be found.");

        // 2. Generate a unique shared Reference ID so these two transactions are forever linked
        const transferRef = `CONTRA-${Date.now().toString().slice(-6)}`;

        // 3. Create the WITHDRAWAL (Expense)
        await Transaction.create({
            amount: amount,
            date: date,
            type: 'EXPENSE',
            accountHead: null, // No expense category, it's a transfer
            paymentMethod: fromAccount.name.toLowerCase().includes('cash') ? 'CASH' : 'BANK',
            bankAccountId: fromAccount._id,
            referenceNumber: transferRef,
            description: `Internal Transfer TO [${toAccount.name}] - ${description}`,
            createdBy,
            status: "VERIFIED" // Contra transfers are usually auto-verified to prevent mismatched books
        });

        // 4. Create the DEPOSIT (Income)
        await Transaction.create({
            amount: amount,
            date: date,
            type: 'INCOME',
            accountHead: null, // No income category, it's a transfer
            paymentMethod: toAccount.name.toLowerCase().includes('cash') ? 'CASH' : 'BANK',
            bankAccountId: toAccount._id,
            referenceNumber: transferRef,
            description: `Internal Transfer FROM [${fromAccount.name}] - ${description}`,
            createdBy,
            status: "VERIFIED" 
        });

        revalidatePath("/finances");
        revalidatePath("/settlements");
        
        return { success: true, error: null };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}