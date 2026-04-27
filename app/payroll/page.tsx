import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { PayrollDashboard } from "@/components/organisms/Admin/PayrollDashboard";

export const dynamic = 'force-dynamic';

export default async function PayrollPage() {
    await dbConnect();

    // 1. Fetch data with .lean()
    const rawStaff = await Staff.find({ status: "ACTIVE" })
        .select("fullName designation salary ssf bankDetails")
        .sort({ fullName: 1 })
        .lean();

    // 2. Explicitly map to "Plain Old JavaScript Objects" (POJOs)
    // We avoid passing the whole 'staff' object to ensure hidden Mongoose logic is gone
    const staffList = rawStaff.map((staff: any) => {
        const s = staff.salary || {};
        const a = s.allowances || {};
        
        // Manual Math with safety fallbacks
        const basic = Number(s.basicSalary) || 0;
        const grade = Number(s.grade) || 0;
        const dearness = Number(s.dearnessAllowance) || 0;
        const allowances = Object.values(a).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);

        return {
            // CRITICAL: Explicitly convert _id to a string here
            _id: staff._id.toString(), 
            fullName: String(staff.fullName || ""),
            designation: String(staff.designation || ""),
            grossSalary: basic + grade + dearness + allowances,
            ssfEnrolled: Boolean(staff.ssf?.enrolled),
            bankName: String(staff.bankDetails?.bankName || "N/A")
        };
    }).filter(s => s.grossSalary > 0);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <header className="flex flex-col gap-2 mb-8">
                <h1 className="text-2xl font-black tracking-tighter text-primary uppercase">
                    Payroll Control Center
                </h1>
                {/* If the error still points here, it's because staffList 
                   still contains a non-serializable object. 
                */}
                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">
                    Registry Sync: Active | BSON Sanitized
                </p>
            </header>

            {/* Final Safeguard: Pass a deep-cloned clean array */}
            <PayrollDashboard staffList={JSON.parse(JSON.stringify(staffList))} />
        </div>
    );
}