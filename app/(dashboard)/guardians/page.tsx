import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import { RegistryTableRow } from "@/components/organisms/guardian/RegistryTableRow";
import { EmptyRegistryState } from "@/components/organisms/guardian/EmptyRegistryState";
import RegistryHeader from "@/components/organisms/guardian/RegisteryHeader";
import StatCards from "@/components/organisms/guardian/StatCards";

export const dynamic = "force-dynamic";

export default async function GuardiansPage() {
    await dbConnect();
    const rawGuardians = await Guardian.find({}).sort({ createdAt: -1 }).lean();
    
    // Deep clean serialization for Client Components
    const guardians = JSON.parse(JSON.stringify(rawGuardians));

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
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
        /* FIX 1: bg-white -> bg-card, border-zinc -> border-border */
        <div className="bg-card rounded-dashboard shadow-glow border border-border overflow-hidden transition-all duration-500">
            <table className="w-full text-left border-collapse bg-card">
                <thead>
                    {/* FIX 2: bg-zinc-50 -> bg-shaded/50 (matches your dark vitals) */}
                    <tr className="bg-shaded/50 border-b border-border">
                        <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Family / Applicant</th>
                        <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Type</th>
                        <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Vetting Status</th>
                        <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Assigned</th>
                        <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                </thead>
                {/* FIX 3: divide-zinc -> divide-border/20 for subtle dark mode separation */}
                <tbody className="bg-card divide-y divide-border/20">
                    {guardians.map((guardian: any) => (
                        <RegistryTableRow key={guardian._id} guardian={guardian} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}