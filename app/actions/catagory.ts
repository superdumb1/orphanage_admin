"use server";
import dbConnect from "@/lib/db";
import Category from "@/models/catagories";
import { revalidatePath } from "next/cache";

export async function AddCatagory(prevState: any, formData: FormData) {
  await dbConnect();
  
  const categoryName = formData.get("categoryName");
  const accountCode = formData.get("accountCode");
  const categoryType = formData.get("categoryType");
  const description = formData.get("description");

  try {
    await Category.create({
      categoryName,
      accountCode,
      categoryType,
      description
    });

    revalidatePath("/finance"); // Adjust path as needed
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: "Failed to create category: " + error.message };
  }
}