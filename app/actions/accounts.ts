"use server";
import dbConnect from "@/lib/db";
import AccountHead from "@/models/AccountHead";
import { revalidatePath } from "next/cache";


export async function addAccountHead(prevState: any, formData: FormData) {
    await dbConnect();

    try {
        await AccountHead.create({
            name: formData.get("name"),
            type: formData.get("type"),
            fundCategory: formData.get("fundCategory"), // 👈 Capture new field
            subType: (formData.get("subType") as string).split(',').filter(Boolean),
            code: formData.get("code"),
            description: formData.get("description")
        });
        revalidatePath("/finance");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}