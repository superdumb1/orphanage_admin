import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import AccountHead from "@/models/AccountHead";
import { PayrollDashboard } from "@/components/organisms/Admin/PayrollDashboard";

export const dynamic = 'force-dynamic';

export default async function PayrollPage() {
    await dbConnect();

    // 1. Fetch Banks and Expense Categories
    const bankAccounts = await AccountHead.find({ type: "ASSET", subType: "Bank" }).lean();
    
    // You likely have an account head specifically for Salaries. 
    // If you don't, you'll need to create one in your Chart of Accounts!
    const salaryHeads = await AccountHead.find({ type: "EXPENSE", name: { $regex: /salary|payroll|wages/i } }).lean();

    // 2. Fetch Active Staff and calculate their salaries for the preview
    const rawStaff = await Staff.find({ status: "ACTIVE" }).sort({ fullName: 1 }).lean();
    
    const staffList = rawStaff.map((staff: any) => {
        const s = staff.salary || {};
        const a = s.allowances || {};
        const grossSalary = 
            (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
            (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
            (a.food || 0) + (a.communication || 0) + (a.other || 0);

        return {
            _id: staff._id.toString(),
            fullName: staff.fullName,
            designation: staff.designation,
            grossSalary,
            ssfEnrolled: staff.ssf?.enrolled || false
        };
    }).filter(s => s.grossSalary > 0);

    // Sanitize account heads
    const safeBanks = bankAccounts.map(b => ({ ...b, _id: b._id.toString() }));
    const safeSalaryHeads = salaryHeads.map(h => ({ ...h, _id: h._id.toString() }));

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <PayrollDashboard 
                staffList={staffList} 
                bankAccounts={safeBanks} 
                salaryHeads={safeSalaryHeads} 
            />
        </div>
    );
}