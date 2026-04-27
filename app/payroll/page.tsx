import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import AccountHead from "@/models/AccountHead";
import PaymentCategory from "@/models/paymentCategory"; // ✨ Import the daily-op model
import { PayrollDashboard } from "@/components/organisms/Admin/PayrollDashboard";

export const dynamic = 'force-dynamic';

export default async function PayrollPage() {
    await dbConnect();

    // 1. Fetch from BOTH systems in parallel
    const [paymentMethods, expenseHeads, rawStaff] = await Promise.all([
        // Daily Ops: Get the actual Bank/Cash/Wallet accounts the orphanage uses
        PaymentCategory.find({ 
            isActive: true, 
        }).lean(),

        // Accounting: Get the "Staff Salary" heads for tallying
        AccountHead.find({ 
            type: "EXPENSE",
            isActive: true,
        }).lean(),

        // Personnel: Active staff only
        Staff.find({ status: "ACTIVE" })
            .select("fullName designation salary ssf bankDetails")
            .sort({ fullName: 1 })
            .lean()
    ]);

    // 2. Process Staff Data
    const staffList = rawStaff.map((staff: any) => {
        const s = staff.salary || {};
        const a = s.allowances || {};
        const basicTotal = (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0);
        const totalAllowances = Object.values(a).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
        
        return {
            _id: staff._id.toString(),
            fullName: staff.fullName,
            designation: staff.designation,
            grossSalary: basicTotal + totalAllowances,
            ssfEnrolled: staff.ssf?.enrolled || false,
            bankName: staff.bankDetails?.bankName || "N/A"
        };
    }).filter(s => s.grossSalary > 0);

    // 3. Serialization
    const sanitize = (docs: any[]) => docs.map(doc => ({
        ...doc,
        _id: doc._id.toString(),
    }));

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <header className="flex flex-col gap-2 mb-8">
                <h1 className="text-2xl font-black font-mono tracking-tighter text-primary uppercase">
                    Payroll Control Center
                </h1>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">
                    Registry Sync: Active | Source: PaymentCategory & AccountHeads
                </p>
            </header>

            <PayrollDashboard 
                staffList={staffList} 
                // ✨ Passing the Payment Categories as the "Source"
                bankAccounts={sanitize(paymentMethods)} 
                // ✨ Passing Account Heads for the "Tallying/Category"
                salaryHeads={sanitize(expenseHeads)} 
            />
        </div>
    );
}