"use server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateUserStatus(userId: string, newStatus: boolean) {
  try {
    await dbConnect();
    
    // Optional: Verify the current session is an ADMIN before allowing this
    
    await User.findByIdAndUpdate(userId, { isActive: newStatus });
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
    try {
      await dbConnect();
      await User.findByIdAndDelete(userId);
      revalidatePath("/admin/users");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
}