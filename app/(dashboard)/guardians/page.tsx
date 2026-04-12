import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import VettingBadge from "@/components/organisms/guardian/VettingBadge";
import StatCards from "@/components/organisms/guardian/StatCards";

export default async function GuardiansPage() {
    await dbConnect();
    const guardians = await Guardian.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="flex flex-col gap-6 max-w-6xl">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Guardian & Foster Registry</h1>
                    <p className="text-sm text-zinc-500 font-medium">Manage family vetting, background checks, and child placements.</p>
                </div>
                <Link href="/guardians/new">
                    <Button className="bg-zinc-900 text-white font-bold py-2.5 px-6 rounded-xl">
                        + Register Family
                    </Button>
                </Link>
            </div>

            <StatCards guardians={guardians} />
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-100">
                            <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Family / Applicant</th>
                            <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Type</th>
                            <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Vetting Status</th>
                            <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Assigned Children</th>
                            <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {guardians.map((guardian: any) => (
                            <tr key={guardian._id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-zinc-900">{guardian.primaryName}</span>
                                        <span className="text-xs text-zinc-500">{guardian.phone}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-2 py-1 rounded">
                                        {guardian.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <VettingBadge status={guardian.vettingStatus} />
                                </td>
                                <td className="p-4 text-sm text-zinc-600">
                                    {guardian.assignedChildren?.length || 0} Children
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/guardians/${guardian._id}`}>
                                        <Button variant="ghost" className="text-xs font-bold border border-zinc-200 group-hover:bg-white">
                                            View Profile
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {guardians.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-2">
                        <span className="text-4xl">🏘️</span>
                        <p className="text-zinc-500 font-medium">No guardians registered yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Components for this page


