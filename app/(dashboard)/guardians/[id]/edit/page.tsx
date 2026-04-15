import React from "react";
import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import EditGuardianForm from "@/components/organisms/guardian/EditGuardianForm";
import Link from "next/link";

export default async function GuardianEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await dbConnect();

    const rawGuardian = await Guardian.findById(id).lean();
    
    if (!rawGuardian) {
        return <div className="p-10 text-center text-zinc-500 font-bold">Guardian not found.</div>;
    }

    const guardian = JSON.parse(JSON.stringify(rawGuardian));

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6 animate-in fade-in duration-500">
            
            {/* Simple Header */}
            <div className="flex items-center gap-4">
                <Link href={`/guardians/${id}`} className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-colors">
                    ←
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Edit Guardian Profile</h1>
                    <p className="text-sm text-zinc-500">Updating records for {guardian.primaryName}</p>
                </div>
            </div>

            {/* The Interactive Form */}
            <EditGuardianForm guardian={guardian} />

        </div>
    );
}