"use client";

import React, { useEffect, useState } from "react";
import { User, ShieldAlert } from "lucide-react";
import GuardianProfileHeader from "@/components/organisms/guardian/GuardianProfileHeader";
import GuardianContactCard from "@/components/organisms/guardian/GuardianContactCard";
import GuardianFinancialCard from "@/components/organisms/guardian/GuardianFinancialCard";
import GuardianVettingVault from "@/components/organisms/guardian/GuardianVettingVault";
import {AssignedChildren} from "@/components/organisms/guardian/AssignedChildren";

interface GuardianDossierModalProps {
    id: string;
    closeModal: () => void;
}

export const GuardianDossierModal = ({ id, closeModal }: GuardianDossierModalProps) => {
    const [guardian, setGuardian] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDossier = async () => {
            try {
                const res = await fetch(`/api/guardians/${id}`);
                const data = await res.json();
                setGuardian(data.guardian);
            } catch (err) {
                console.error("Dossier Retrieval Fault:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDossier();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">
                    Retrieving Encrypted Dossier...
                </p>
            </div>
        );
    }

    if (!guardian) {
        return (
            <div className="p-20 text-center flex flex-col items-center gap-4">
                <ShieldAlert className="text-danger w-12 h-12" />
                <p className="text-sm font-black text-text uppercase tracking-widest">Access Denied: Record Not Found</p>
                <button onClick={closeModal} className="btn-primary px-8">Return to Registry</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. HEADER: Integrated logic from your original page */}
            <GuardianProfileHeader guardian={guardian} id={id} />

            {/* 2. MAIN WORKSPACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Left Column: Sidebar Info (2/5 width) */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <GuardianContactCard guardian={guardian} />
                    <GuardianFinancialCard guardian={guardian} />
                </div>

                {/* Right Column: Main Workspace (3/5 width) */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                    <GuardianVettingVault guardian={guardian} id={id} />
                    <AssignedChildren guardian={guardian} />
                </div>

            </div>

            {/* AUDIT FOOTER */}
            <div className="pt-6 border-t border-border/30 opacity-40">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] text-center">
                    End of Record // Kree Corp Internal Placement Protocol
                </p>
            </div>
        </div>
    );
};