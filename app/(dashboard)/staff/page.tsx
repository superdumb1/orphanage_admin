import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { StatBox } from "@/components/atoms/StatBox";

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
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Employees</h1>
                    <p className="text-sm text-zinc-500">Manage workforce, roles, and payroll</p>
                </div>
                <Link href="/staff/new">
                    <Button variant="primary" className="shadow-sm">+ Add Employee</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox
                    label="Total Employees"
                    subLabel="कुल कर्मचारी"
                    value={activeCount}
                    icon={<span className="text-2xl">👥</span>}
                    color="text-blue-600"
                />
                <StatBox
                    label="Monthly Gross Payroll"
                    subLabel="मासिक कुल तलब"
                    value={`Rs. ${totalMonthlyPayroll.toLocaleString()}`}
                    icon={<span className="text-2xl">💵</span>}
                    color="text-emerald-600"
                />
                <StatBox
                    label="SSF Enrolled"
                    subLabel="SSF भर्ना (MANDATORY)"
                    value={ssfCount}
                    icon={<span className="text-2xl">🛡️</span>}
                    color="text-purple-600"
                />
                <StatBox
                    label="PF/CIT Enrolled"
                    subLabel="संचय कोष / नागरिक लगानी कोष"
                    value={pfCitCount}
                    icon={<span className="text-2xl">🏦</span>}
                    color="text-orange-600"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 whitespace-nowrap">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900">
                            <tr>
                                <th className="p-4 font-bold tracking-wide">Employee Details</th>
                                <th className="p-4 font-bold tracking-wide">Designation & Dept</th>
                                <th className="p-4 font-bold tracking-wide">Employment</th>
                                <th className="p-4 font-bold tracking-wide text-right">Gross Salary (NPR)</th>
                                <th className="p-4 font-bold tracking-wide text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {staffMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                                        <p className="text-lg mb-1">No employees found.</p>
                                        <p className="text-sm">Click "Add Employee" to create your first staff record.</p>
                                    </td>
                                </tr>
                            ) : (
                                staffMembers.map((person) => (
                                    <tr key={person._id.toString()} className="hover:bg-zinc-50/80 transition-colors group">

                                        <td className="p-4 flex items-center gap-4">
                                            {person.profileImageUrl ? (
                                                <img src={person.profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-zinc-200 shadow-sm" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm border border-rose-100">
                                                    {person.fullName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-zinc-900">
                                                    {person.fullName} {person.nepaliName && <span className="font-normal text-zinc-400 text-xs ml-1">({person.nepaliName})</span>}
                                                </span>
                                                <span className="text-xs text-zinc-500">{person.email} • {person.phone}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-zinc-900">{person.designation || 'Not Assigned'}</span>
                                                <span className="text-xs text-zinc-500">{person.department?.replace("_", " ") || 'General'}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                                    {person.employmentType?.replace("_", " ") || 'ACTIVE'}
                                                </span>
                                                {person.ssf?.type === "SSF" && (
                                                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100">SSF Enrolled</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-right">
                                            <span className="font-bold text-emerald-700">
                                                {person.grossSalary > 0 ? person.grossSalary.toLocaleString() : 'Not Set'}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center">
                                            <Link href={`/staff/${person._id.toString()}`}>
                                                <Button variant="ghost" className="text-xs text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 px-3">
                                                    Manage
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}