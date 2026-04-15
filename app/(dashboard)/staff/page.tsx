import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { StatBox } from "@/components/atoms/StatBox";
import StaffHomeTop from "@/components/organisms/staffs/StaffHomeTop";

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    await dbConnect();
    const rawStaffMembers = await Staff.find({}).sort({ fullName: 1 }).lean() as any[];

    const staffMembers = rawStaffMembers.map(staff => {
        const s = staff.salary || {};
        const a = s.allowances || {};
        const grossSalary =
            (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
            (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
            (a.food || 0) + (a.communication || 0) + (a.other || 0);

        return { ...staff, grossSalary };
    });

    const totalMonthlyPayroll = staffMembers.reduce((sum, s) => sum + s.grossSalary, 0);
    const ssfCount = staffMembers.filter(s => s.ssf?.type === "SSF").length;
    const pfCitCount = staffMembers.filter(s => s.ssf?.type === "PF_CIT").length;
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
                                <th className="p-5 font-black uppercase tracking-widest text-[10px]">Employee Details</th>
                                <th className="p-5 font-black uppercase tracking-widest text-[10px]">Designation & Dept</th>
                                <th className="p-5 font-black uppercase tracking-widest text-[10px]">Employment</th>
                                <th className="p-5 font-black uppercase tracking-widest text-[10px] text-right">Gross Salary (NPR)</th>
                                <th className="p-5 font-black uppercase tracking-widest text-[10px] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {staffMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-text-muted">
                                        <p className="text-xl font-bold text-text mb-1">No employees found.</p>
                                        <p className="text-sm opacity-70">Click "Add Employee" to create your first staff record.</p>
                                    </td>
                                </tr>
                            ) : (
                                staffMembers.map((person) => (
                                    <MemberCardRow key={`staffmember${person._id}`} person={person} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const Stats = ({ activeCount, totalMonthlyPayroll, ssfCount, pfCitCount }: { activeCount: number, totalMonthlyPayroll: number, ssfCount: number, pfCitCount: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox
                label="Total Employees"
                subLabel="कुल कर्मचारी"
                value={activeCount}
                icon={<span className="text-2xl">👥</span>}
            />
            <StatBox
                label="Monthly Gross Payroll"
                subLabel="मासिक कुल तलब"
                value={`Rs. ${totalMonthlyPayroll.toLocaleString()}`}
                icon={<span className="text-2xl">💵</span>}
            />
            <StatBox
                label="SSF Enrolled"
                subLabel="SSF भर्ना"
                value={ssfCount}
                icon={<span className="text-2xl">🛡️</span>}
            />
            <StatBox
                label="PF/CIT Enrolled"
                subLabel="संचय कोष / नागरिक लगानी"
                value={pfCitCount}
                icon={<span className="text-2xl">🏦</span>}
            />
        </div>
    )
}

const MemberCardRow = ({ person }: { person: any }) => {
    return (
        <tr className="hover:bg-shaded/50 transition-colors group">
            <td className="p-4 flex items-center gap-4">
                {person.profileImageUrl ? (
                    <img src={person.profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center font-black text-xs border border-danger/20">
                        {person.fullName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-bold text-text group-hover:text-primary transition-colors">
                        {person.fullName} 
                        {person.nepaliName && <span className="font-normal text-text-muted text-[10px] ml-2 italic">({person.nepaliName})</span>}
                    </span>
                    <span className="text-[11px] text-text-muted/70">{person.email} • {person.phone}</span>
                </div>
            </td>

            <td className="p-4">
                <div className="flex flex-col">
                    <span className="font-bold text-text/90 text-xs">{person.designation || 'Not Assigned'}</span>
                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{person.department?.replace("_", " ") || 'General'}</span>
                </div>
            </td>

            <td className="p-4">
                <div className="flex flex-col gap-1.5 items-start">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {person.employmentType?.replace("_", " ") || 'ACTIVE'}
                    </span>
                    {person.ssf?.type === "SSF" && (
                        <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-black border border-accent/20 uppercase tracking-tighter">SSF Enrolled</span>
                    )}
                </div>
            </td>

            <td className="p-4 text-right">
                <span className="font-black text-success tabular-nums">
                    {person.grossSalary > 0 ? `Rs. ${person.grossSalary.toLocaleString()}` : 'Not Set'}
                </span>
            </td>

            <td className="p-4 text-center">
                <Link href={`/staff/${person._id.toString()}`}>
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-text-muted border border-border hover:bg-bg hover:text-text px-4 py-1.5 transition-all">
                        Manage
                    </Button>
                </Link>
            </td>
        </tr>
    )
}