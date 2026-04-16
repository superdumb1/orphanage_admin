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

export async function updateInventoryItem(prevState: any, formData: FormData) {
    await dbConnect();

    try {
        const id = formData.get("id") as string;
        
        if (!id) {
            throw new Error("Missing Item ID for update.");
        }

        // 1. Gather the fields that are allowed to be edited
        const updateData = {
            name: formData.get("name"),
            category: formData.get("category"),
            unit: formData.get("unit"),
            minimumStockLevel: Number(formData.get("minimumStockLevel")) || 10,
            // 🔒 SECURITY: Notice currentStock is intentionally omitted here. 
            // It can only be altered through adjustStock().
        };

        // 2. Perform the update
        const updatedItem = await InventoryItem.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, // Returns the updated document
                runValidators: true // Enforces your Mongoose schema rules
            } 
        );

        if (!updatedItem) {
            throw new Error("Inventory item not found or already deleted.");
        }

        // 3. Clear cache to reflect new data on the UI
        revalidatePath("/inventory");
        return { success: true };
        
    } catch (error: any) {
        // Handle duplicate name collision (MongoDB Error 11000)
        if (error.code === 11000) {
            return { success: false, error: "Another item is already using this name." };
        }
        return { success: false, error: error.message };
    }
}