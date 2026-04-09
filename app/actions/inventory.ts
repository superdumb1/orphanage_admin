"use server";
import dbConnect from "@/lib/db";
import InventoryTransaction from "@/models/InventoryTransaction"; // Make sure this is imported at the top!
import InventoryItem from "@/models/InventoryItem";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInventoryItem(prevState: any, formData: FormData) {
    await dbConnect();
    const raw = Object.fromEntries(formData.entries());

    const initialQty = Number(raw.initialQuantity) || 0;
    const source = raw.purposeOrSource as string || "Initial Catalog Setup";
    
    // Extract the new fields
    const acquisitionType = raw.acquisitionType as string;
    const totalCost = Number(raw.totalCost) || 0;

    try {
        const newItem = await InventoryItem.create({
            itemName: raw.itemName,
            category: raw.category,
            unit: raw.unit,
            minQuantityAlert: Number(raw.minQuantityAlert) || 10,
            location: raw.location,
            currentQuantity: initialQty 
        });

        // If they added starting stock, log it with the purchase details!
        if (initialQty > 0) {
            await InventoryTransaction.create({
                itemId: newItem._id,
                transactionType: "STOCK_IN",
                quantity: initialQty,
                purposeOrSource: source,
                acquisitionType: acquisitionType, // Save if it was Bought or Donated
                totalCost: acquisitionType === "PURCHASED" ? totalCost : 0, // Enforce 0 cost if donated
                date: new Date()
            });
        }

    } catch (error: any) {
        console.error("Failed to create inventory item:", error);
        if (error.code === 11000) return { error: `An item named "${raw.itemName}" already exists in your catalog!` };
        if (error.name === "ValidationError") return { error: `Validation Error: ${error.message}` };
        return { error: "Failed to add item to catalog: " + error.message };
    }

    revalidatePath("/inventory");
    redirect("/inventory");
}
export async function recordStockTransaction(formData: FormData) {
    await dbConnect();
    const raw = Object.fromEntries(formData.entries());
    
    const itemId = raw.itemId as string;
    const type = raw.transactionType as string; // "STOCK_IN" or "STOCK_OUT"
    const qty = Number(raw.quantity);
    const purposeOrSource = raw.purposeOrSource as string;

    // ✨ NEW: Dynamically determine acquisition details based on transaction type
    const acquisitionType = type === "STOCK_IN" ? (raw.acquisitionType as string || "DONATED") : "CONSUMED";
    const totalCost = type === "STOCK_IN" && acquisitionType === "PURCHASED" ? (Number(raw.totalCost) || 0) : 0;

    try {
        const item = await InventoryItem.findById(itemId);
        if (!item) throw new Error("Item not found");

        if (type === "STOCK_OUT" && item.currentQuantity < qty) {
            throw new Error(`Not enough stock! You only have ${item.currentQuantity} ${item.unit} left.`);
        }

        // 1. Save the transaction trail WITH cost details
        await InventoryTransaction.create({
            itemId: itemId,
            transactionType: type,
            quantity: qty,
            purposeOrSource: purposeOrSource,
            acquisitionType: acquisitionType, 
            totalCost: totalCost,             
            date: raw.date ? new Date(raw.date as string) : new Date(),
        });

        // 2. Update the main item's current quantity
        const mathOperator = type === "STOCK_IN" ? qty : -qty; 
        
        await InventoryItem.findByIdAndUpdate(itemId, {
            $inc: { currentQuantity: mathOperator }
        });

    } catch (error) {
        console.error("Stock Transaction Error:", error);
        throw new Error("Failed to record stock movement.");
    }

    revalidatePath("/inventory");
    redirect("/inventory");
}