import React from "react";
import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import "@/models/Child"; 

// Import your shiny new modular components
import GuardianProfileHeader from "@/components/organisms/guardian/GuardianProfileHeader";
import GuardianContactCard from "@/components/organisms/guardian/GuardianContactCard";
import GuardianFinancialCard from "@/components/organisms/guardian/GuardianFinancialCard";
import GuardianVettingVault from "@/components/organisms/guardian/GuardianVettingVault";
import AssignedChildren from "@/components/organisms/guardian/AssignedChildren";

export const dynamic = "force-dynamic";

export default async function GuardianProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await dbConnect();

    const rawGuardian = await Guardian.findById(id).populate("assignedChildren").lean();
    
    if (!rawGuardian) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <h2 className="text-xl font-black text-zinc-900">Guardian Not Found</h2>
            </div>
        );
    }

    const guardian = JSON.parse(JSON.stringify(rawGuardian));

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10 p-6 animate-in fade-in duration-500">
            
            {/* 1. Header with Profile Pic */}
            <GuardianProfileHeader guardian={guardian} id={id} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 2. Left Column (Sidebar Info) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <GuardianContactCard guardian={guardian} />
                    <GuardianFinancialCard guardian={guardian} />
                </div>

                {/* 3. Right Column (Main Workspace) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <GuardianVettingVault guardian={guardian} id={id} />
                    <AssignedChildren guardian={guardian} />
                </div>

            </div>
        </div>
    );
}