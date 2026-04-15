"use server";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { normalizeStaff } from "@/lib/normalizers"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



export async function createStaff(prevState: any, formData: FormData) {
  await dbConnect();
  const payload = normalizeStaff(formData);

  try {
    await Staff.create(payload);
    revalidatePath("/staff");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Save Error:", error);
    return { success: false, error: "Failed to create staff: " + error.message };
  }
}



export async function updateStaff(prevState: any, formData: FormData) {
  await dbConnect();
  const id = formData.get("_id") as string;
  if (!id) return { success: false, error: "Staff ID is missing" };

  const payload = normalizeStaff(formData);

  try {
    await Staff.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    revalidatePath("/staff");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update staff: " + error.message };
  }
}