"use server";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { normalizeStaff } from "@/lib/normalizers";
import { revalidatePath } from "next/cache";
import { StaffFormInputs } from "@/types/StaffFormInputs";

export async function createStaff(prevState: any, formData: FormData) {
  await dbConnect();

  // 1. Normalize the payload
  const payload = normalizeStaff(formData) as StaffFormInputs;
  // ✨ Safety: Ensure userId is either a valid ID or removed entirely
  if (!payload.userId || payload.userId === "") {
    delete payload.userId;
  }

  try {
    // 2. Create the record
    await Staff.create(payload);

    // 3. Refresh the UI
    revalidatePath("/staff");
    return { success: true, error: null };
  } catch (error: any) {
    // Catch duplicate Email or Phone errors specifically
    if (error.code === 11000) {
      return { success: false, error: "Identity Conflict: Email or Phone already exists in registry." };
    }
    console.error("Save Error:", error);
    return { success: false, error: "Failed to create staff: " + error.message };
  }
}

export async function updateStaff(prevState: any, formData: FormData) {
  await dbConnect();
  const id = formData.get("_id") as string;
  if (!id) return { success: false, error: "Critical Error: Personnel ID missing for update." };

  const payload = normalizeStaff(formData);

  try {
    await Staff.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    revalidatePath("/staff");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, error: "Update Protocol Failed: " + error.message };
  }
}