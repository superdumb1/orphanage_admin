import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import VettingBadge from "@/components/organisms/guardian/VettingBadge";
import StatCards from "@/components/organisms/guardian/StatCards";
import RegistryHeader from "@/components/organisms/guardian/RegisteryHeader";

export const dynamic = "force-dynamic";


export default async function GuardiansPage() {
    await dbConnect();
    const rawGuardians = await Guardian.find({}).sort({ createdAt: -1 }).lean();
    const guardians = JSON.parse(JSON.stringify(rawGuardians));

    return (
        <div className="flex flex-col gap-6 max-w-6xl animate-in fade-in duration-500">
            <RegistryHeader />
            <StatCards guardians={guardians} />
            <RegistryTable guardians={guardians} />
        </div>
    );
}




function RegistryTable({ guardians }: { guardians: any[] }) {
    if (guardians.length === 0) {
        return <EmptyRegistryState />;
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Family / Applicant</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Type</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Vetting Status</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Assigned</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {guardians.map((guardian) => (
                        <RegistryTableRow key={guardian._id} guardian={guardian} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function RegistryTableRow({ guardian }: { guardian: any }) {
    return (
        <tr className="hover:bg-zinc-50/80 transition-colors group">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-zinc-200 shadow-sm bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                        {guardian.profileImageUrl ? (
                            <img 
                                src={guardian.profileImageUrl} 
                                alt={guardian.primaryName} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <span className="text-lg">👤</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {guardian.primaryName}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">{guardian.phone}</span>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {guardian.type}
                </span>
            </td>
            <td className="p-4">
                <VettingBadge status={guardian.vettingStatus} />
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-700 bg-zinc-100 w-6 h-6 rounded-full flex items-center justify-center">
                        {guardian.assignedChildren?.length || 0}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">Children</span>
                </div>
            </td>
            <td className="p-4 text-right">
                <Link href={`/guardians/${guardian._id}`}>
                    <Button variant="ghost" className="text-xs font-bold text-zinc-500 border border-zinc-200 group-hover:bg-white group-hover:border-zinc-300 group-hover:text-zinc-900 transition-all rounded-xl">
                        View Profile →
                    </Button>
                </Link>
            </td>
        </tr>
    );
}

function EmptyRegistryState() {
    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden p-16 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-3xl shadow-sm border border-zinc-200">
                🏘️
            </div>
            <div>
                <p className="text-zinc-900 font-bold">No families registered yet.</p>
                <p className="text-sm text-zinc-500 mt-1">Click "Register Family" to start building your database.</p>
            </div>
        </div>
    );
}