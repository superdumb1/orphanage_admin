"use server";
import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGuardian(prevState: any, formData: FormData) {
    await dbConnect();
    const rawData = Object.fromEntries(formData.entries()) as any;
    
    // Handle background check files
    const docFiles = formData.getAll("documents") as File[];
    const documentUrls: string[] = [];

    // We'll use this to track if we should redirect after the try/catch
    let success = false;

    try {
        for (const file of docFiles) {
            // Check if it's actually a file with content
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                // Using the 'guardian_vault' folder for clean organization
                const url = await uploadImage(buffer, "guardian_vault");
                documentUrls.push(url);
            }
        }

        const payload = {
            ...rawData,
            annualIncome: Number(rawData.annualIncome) || 0,
            backgroundCheckDocs: documentUrls
        };

        await Guardian.create(payload);
        success = true;

    } catch (error: any) {
        console.error("Guardian Save Error:", error);
        
        // Return structured error that matches our ActionState type
        return { 
            error: error.code === 11000 
                ? "This email is already registered to a guardian." 
                : "Database error: " + (error.message || "Unknown error"),
            success: false 
        };
    }

    // Redirect must happen OUTSIDE the try/catch block 
    // because redirect() works by throwing a special Next.js error
    if (success) {
        revalidatePath("/guardians");
        redirect("/guardians");
    }
}