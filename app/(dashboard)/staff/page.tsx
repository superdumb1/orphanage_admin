import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { StatBox } from "@/components/atoms/StatBox";
import StaffHomeTop from "@/components/organisms/staffs/StaffHomeTop";
import MemberCardRow from "@/components/organisms/staffs/staffpage/MemberCardRow";

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    await dbConnect();

    // 1. Fetch raw data
    const rawStaffMembers = await Staff.find({}).sort({ firstName: 1 }).lean();

    // 2. Sanitize and Calculate (Prepare the payload for the Client)
    const staffMembers = rawStaffMembers.map((person: any) => {
    const s = person.salary || {};
    const a = s.allowances || {};

    const grossSalary =
        (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
        (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
        (a.food || 0) + (a.communication || 0) + (a.other || 0);

    return JSON.parse(JSON.stringify({
        ...person,
        _id: person._id?.toString(),
        grossSalary,
        admissionDate: person.admissionDate ? new Date(person.admissionDate).toISOString() : null,
        createdAt: person.createdAt ? new Date(person.createdAt).toISOString() : null,
        updatedAt: person.updatedAt ? new Date(person.updatedAt).toISOString() : null,
    }));
});

    // 3. Stats calculation
    const totalMonthlyPayroll = staffMembers.reduce((sum, s) => sum + s.grossSalary, 0);
    const ssfCount = staffMembers.filter(s => s.ssfType === "SSF").length;
    const pfCitCount = staffMembers.filter(s => s.ssfType === "PF_CIT").length;
    const activeCount = staffMembers.length;

    return (
        <div className="flex flex-col gap-8 pb-10 transition-colors duration-500">
            <StaffHomeTop />

            <Stats
                activeCount={activeCount}
                totalMonthlyPayroll={totalMonthlyPayroll}
                ssfCount={ssfCount}
                pfCitCount={pfCitCount}
            />

            <div className="bg-card rounded-dashboard shadow-glow border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-text-muted whitespace-nowrap">
                        <thead className="bg-shaded border-b border-border text-text">
                            <tr>
                                <th className="p-5 font-black uppercase tracking-[0.2em] text-[10px]">Employee Details</th>
                                <th className="p-5 font-black uppercase tracking-[0.2em] text-[10px]">Designation & Dept</th>
                                <th className="p-5 font-black uppercase tracking-[0.2em] text-[10px]">Employment</th>
                                <th className="p-5 font-black uppercase tracking-[0.2em] text-[10px] text-right">Gross Salary (NPR)</th>
                                <th className="p-5 font-black uppercase tracking-[0.2em] text-[10px] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {staffMembers.length === 0 ? (
                                <EmptyState />
                            ) : (
                                staffMembers.map((person) => (
                                    <MemberCardRow key={`staffmember-${person._id}`} person={person} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const EmptyState = () => (
    <tr>
        <td colSpan={5} className="p-20 text-center">
            <div className="flex flex-col items-center gap-2">
                <span className="text-4xl grayscale opacity-50 mb-4">📂</span>
                <p className="text-lg font-black text-text uppercase tracking-tighter">Database Empty</p>
                <p className="text-sm text-text-muted">No personnel files found in the current directive.</p>
            </div>
        </td>
    </tr>
);

const Stats = ({ activeCount, totalMonthlyPayroll, ssfCount, pfCitCount }: any) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Total Employees" subLabel="कुल कर्मचारी" value={activeCount} icon="👥" />
        <StatBox label="Monthly Payroll" subLabel="मासिक कुल तलब" value={`Rs. ${totalMonthlyPayroll.toLocaleString()}`} icon="💵" />
        <StatBox label="SSF Enrolled" subLabel="SSF भर्ना" value={ssfCount} icon="🛡️" />
        <StatBox label="PF/CIT Enrolled" subLabel="संचय कोष / नागरिक लगानी" value={pfCitCount} icon="🏦" />
    </div>
);