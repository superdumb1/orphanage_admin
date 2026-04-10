"use server";
import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import Child from "@/models/Child";
import { revalidatePath } from "next/cache";

export async function assignChildToGuardian(prevState: any, formData: FormData) {
    await dbConnect();
    
    const guardianId = formData.get("guardianId") as string;
    const childId = formData.get("childId") as string;
    const placementType = formData.get("placementType") as string; // 'FOSTERED' or 'ADOPTED'

    try {
        // 1. Update the Child: Set status and link the guardian
        await Child.findByIdAndUpdate(childId, {
            status: placementType,
            guardian: guardianId
        });

        // 2. Update the Guardian: Add child to their array
        await Guardian.findByIdAndUpdate(guardianId, {
            $addToSet: { assignedChildren: childId }
        });

        revalidatePath(`/guardians/${guardianId}`);
        revalidatePath(`/children/${childId}`);
        
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: "Placement failed: " + error.message };
    }
}