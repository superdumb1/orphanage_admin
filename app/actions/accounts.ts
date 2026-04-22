"use server";
import dbConnect from "@/lib/db";
import AccountHead from "@/models/AccountHead";
import { revalidatePath } from "next/cache";

export async function addAccountHead(prevState: any, formData: FormData) {
    await dbConnect();

    try {
        const id = formData.get("id") as string;
        
        // ✨ THE FIX: Extract ALL hidden inputs sharing the exact name "subType"
        const subTypesArray = formData.getAll("subType").filter(Boolean);

        const accountData = {
            name: formData.get("name"),
            type: formData.get("type"),
            fundCategory: formData.get("fundCategory"), 
            subType: subTypesArray, // Array is safely passed directly to Mongoose
            code: formData.get("code"),
            description: formData.get("description")
        };

        if (id) {
            // UPDATE EXISTING RECORD
            await AccountHead.findByIdAndUpdate(id, accountData, { runValidators: true });
        } else {
            // CREATE NEW RECORD
            await AccountHead.create(accountData);
        }

        // Revalidate wherever your charts are displayed
        revalidatePath("/finance");
        revalidatePath("/accounts_headers"); 
        
        return { success: true };
    } catch (error: any) {
        // Handle duplicate GL Code errors gracefully
        if (error.code === 11000) {
            return { success: false, error: "An account with this Name or GL Code already exists." };
        }
        return { success: false, error: error.message };
    }
}