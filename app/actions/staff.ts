"use server";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { normalizeStaff } from "@/lib/normalizers"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStaff(formData: FormData) {
  await dbConnect();
  
  const payload = normalizeStaff(formData);
  
  // (If you have your photo upload logic here, keep it!)

  try {
    await Staff.create(payload);
  } catch (error) {
    console.error("Save Error:", error);
    // THE FIX: Throw an error instead of returning an object
    throw new Error("Failed to create staff"); 
  }

  revalidatePath("/staff");
  redirect("/staff");
}

// Add this inside app/actions/staff.ts
export async function updateStaff(formData: FormData) {
  await dbConnect();
  
  // Extract the hidden ID we will add to the form
  const id = formData.get("_id") as string;
  
  if (!id) throw new Error("Staff ID is missing");

  // Re-use your amazing normalizer
  const payload = normalizeStaff(formData);

  try {
    // Update the record in MongoDB
    await Staff.findByIdAndUpdate(id, payload, { new: true });
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Failed to update staff");
  }

  // Clear the cache and send the user back to the profile page
  revalidatePath("/staff");
  revalidatePath(`/staff/${id}`);
  redirect(`/staff/${id}`);
}