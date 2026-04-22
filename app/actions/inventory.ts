"use server";
import dbConnect from "@/lib/db";
import InventoryItem from "@/models/InventoryItem";
import InventoryLog from "@/models/InventoryLog";
import { revalidatePath } from "next/cache";
import Transaction from "@/models/Transaction";
import AccountHead from "@/models/AccountHead"; // ✨ MUST IMPORT THIS


export async function addInventoryItem(prevState: any, formData: FormData) {
    await dbConnect();

    try {
        await InventoryItem.create({
            name: formData.get("name"),
            category: formData.get("category"),
            unit: formData.get("unit"),
            description: formData.get("description"), // ✨ ADDED
            currentStock: 0, 
            minimumStockLevel: Number(formData.get("minimumStockLevel")) || 10,
        });

        revalidatePath("/inventory");
        return { success: true };
    } catch (error: any) {
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

        const createdBy = formData.get("createdBy") as string;
        const status = formData.get("status") as string;

        if (!createdBy) throw new Error("Security Violation: User session not found.");

        const cost = Number(formData.get("cost") || 0);
        let accountHead = formData.get("accountHead") as string; // Changed from const to let
        
        const rawBankAccountId = formData.get("bankAccountId") as string;
        const bankAccountId = rawBankAccountId === "" ? null : rawBankAccountId;

        // ✨ THE MAGIC FALLBACK LOGIC
        if (type === 'IN' && cost > 0 && !accountHead) {
            // Find the default account
            let defaultAccount = await AccountHead.findOne({ name: "Staff/Samity Personal Cash Spend" });
            
            // If it doesn't exist, auto-create it instantly to prevent crashes
            if (!defaultAccount) {
                defaultAccount = await AccountHead.create({
                    name: "Staff/Samity Personal Cash Spend",
                    type: "EXPENSE",
                    fundCategory: "UNRESTRICTED",
                    code: "EXP-STAFF",
                    description: "Auto-generated default account for staff out-of-pocket or unclassified cash purchases.",
                    isSystem: true, // Protects it from being deleted in the UI
                    isActive: true
                });
            }
            
            // Route the transaction to this new/found account
            accountHead = defaultAccount._id.toString();
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
            throw new Error(`Cannot consume ${quantity}. Only ${updatedItem.currentStock + quantity} left in stock.`);
        }

        const log = await InventoryLog.create({
            item: itemId,
            quantity,
            type,
            reason,
            date: new Date(),
            createdBy 
        });

        if (type === 'IN' && cost > 0 && accountHead) {
            await Transaction.create({
                amount: cost, // Saved as a positive number!
                date: new Date(formData.get("date") as string || Date.now()),
                type: 'EXPENSE', // This is what tells the system it's a deduction
                logId: log._id,
                accountHead: accountHead, // Now safely populated
                paymentMethod: formData.get("paymentMethod") || 'CASH',
                bankAccountId: bankAccountId, 
                donorOrVendorName: formData.get("donorOrVendorName"),
                referenceNumber: formData.get("referenceNumber"),
                description: `Inventory Purchase: ${quantity} ${updatedItem.unit} of ${updatedItem.name}. Reason: ${reason}`,
                createdBy, 
                status     
            });
        }

        revalidatePath("/inventory");
        revalidatePath("/finances"); 
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

        const updateData = {
            name: formData.get("name"),
            category: formData.get("category"),
            unit: formData.get("unit"),
            description: formData.get("description"), // ✨ ADDED
            minimumStockLevel: Number(formData.get("minimumStockLevel")) || 10,
        };

        const updatedItem = await InventoryItem.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true,
                runValidators: true 
            } 
        );

        if (!updatedItem) {
            throw new Error("Inventory item not found or already deleted.");
        }

        revalidatePath("/inventory");
        return { success: true };
        
    } catch (error: any) {
        if (error.code === 11000) {
            return { success: false, error: "Another item is already using this name." };
        }
        return { success: false, error: error.message };
    }
}