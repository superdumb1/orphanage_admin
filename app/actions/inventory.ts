"use server";
import dbConnect from "@/lib/db";
import InventoryItem from "@/models/InventoryItem";
import InventoryLog from "@/models/InventoryLog";
import { revalidatePath } from "next/cache";
import Transaction from "@/models/Transaction";

export async function addInventoryItem(prevState: any, formData: FormData) {
    await dbConnect();

    try {
        await InventoryItem.create({
            name: formData.get("name"),
            category: formData.get("category"),
            unit: formData.get("unit"),
            currentStock: 0, // Stock only changes when they "Receive" or "Consume" items
            minimumStockLevel: Number(formData.get("minimumStockLevel")) || 10,
        });

        revalidatePath("/inventory");
        return { success: true };
    } catch (error: any) {
        // Prevent crashing if they try to add "Rice" twice
        if (error.code === 11000) {
            return { success: false, error: "An item with this exact name already exists." };
        }
        return { success: false, error: error.message };
    }
}

export async function adjustStock(prevState: any, formData: FormData) {
    await dbConnect();

    try {
        const itemId = formData.get("itemId") as string;
        const quantity = Number(formData.get("quantity"));
        const type = formData.get("type") as 'IN' | 'OUT';
        const reason = formData.get("reason") as string;

        // Capture financial details
        const cost = Number(formData.get("cost") || 0);
        const accountHead = formData.get("accountHead") as string;

        // 🚨 THE FIX: Block the form if they add a cost but forget the account!
        if (type === 'IN' && cost > 0 && !accountHead) {
            throw new Error("You entered a cost, but forgot to select an Expense Account!");
        }

        const stockChange = type === 'IN' ? quantity : -quantity;

        const updatedItem = await InventoryItem.findByIdAndUpdate(
            itemId,
            { $inc: { currentStock: stockChange } },
            { returnDocument: 'after' }
        );
        if (!updatedItem) throw new Error("Item not found");

        if (updatedItem.currentStock < 0) {
            await InventoryItem.findByIdAndUpdate(itemId, { $inc: { currentStock: -stockChange } });
            throw new Error(`Cannot remove ${quantity}. Only ${updatedItem.currentStock + quantity} left in stock.`);
        }

        const log = await InventoryLog.create({
            item: itemId,
            quantity,
            type,
            reason,
            date: new Date()
        });

        // THE BRIDGE BETWEEN INVENTORY AND FINANCE!
        if (type === 'IN' && cost > 0 && accountHead) {
            await Transaction.create({
                amount: cost,
                date: new Date(formData.get("date") as string || Date.now()),
                type: 'EXPENSE',
                logId: log._id,
                accountHead: accountHead,
                paymentMethod: formData.get("paymentMethod") || 'CASH',
                donorOrVendorName: formData.get("donorOrVendorName"),
                referenceNumber: formData.get("referenceNumber"),
                description: `Inventory Purchase: ${quantity} ${updatedItem.unit} of ${updatedItem.name}. Reason: ${reason}`
            });
        }

        revalidatePath("/inventory");
        revalidatePath("/finance"); // Update the ledger too!
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}