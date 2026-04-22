"use server";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import Transaction from "@/models/Transaction";
import { revalidatePath } from "next/cache";

export async function processMonthlyPayroll(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    const bankAccountId = formData.get("bankAccountId") as string;
    const salaryAccountHeadId = formData.get("salaryAccountHeadId") as string;
    const monthYear = formData.get("monthYear") as string; // Format: "YYYY-MM"

    if (!bankAccountId || !salaryAccountHeadId || !monthYear) {
      return { error: "Missing required financial routing parameters." };
    }

    // 1. Fetch all ACTIVE personnel
    const activeStaff = await Staff.find({ status: "ACTIVE" }).lean();
    if (!activeStaff.length) return { error: "No active personnel found on roster." };

    // 2. Prevent Double-Processing
    // Check if payroll transactions already exist for this specific month
    const existingPayroll = await Transaction.findOne({
        type: "EXPENSE",
        description: { $regex: `\\[PAYROLL\\] - ${monthYear}` }
    });

    if (existingPayroll) {
        return { error: `Security Lockout: Payroll for ${monthYear} has already been processed.` };
    }

    // 3. Calculate and Generate Transactions
    const transactionsToInsert = activeStaff.map((staff) => {
      const s = staff.salary || {};
      const a = s.allowances || {};
      
      const grossSalary = 
        (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
        (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
        (a.food || 0) + (a.communication || 0) + (a.other || 0);

      // (Optional) If SSF is enrolled, subtract employee contribution to get Net Pay
      // const netPay = staff.ssf?.enrolled ? grossSalary - (staff.ssf.employeeContribution || 0) : grossSalary;

      return {
        amount: grossSalary, // Or use netPay if you want to log exact cash leaving bank
        type: "EXPENSE",
        paymentMethod: "BANK",
        accountHead: salaryAccountHeadId,
        status: "VERIFIED", // Admin is running this, so it's auto-verified
        description: `[PAYROLL] - ${monthYear} // Salary disbursement for ${staff.fullName}`,
        date: new Date(),
        // Link the transaction to the staff's user account if they have one, for audit trails
        createdBy: staff.userId || null 
      };
    }).filter(tx => tx.amount > 0); // Don't process people with Rs. 0 salary

    if (transactionsToInsert.length === 0) {
        return { error: "No personnel have a configured salary > 0." };
    }

    // 4. Execute Batch Insert
    await Transaction.insertMany(transactionsToInsert);

    revalidatePath("/finance");
    return { success: true, count: transactionsToInsert.length };

  } catch (error: any) {
    return { error: error.message || "Payroll Execution Protocol Failed." };
  }
}