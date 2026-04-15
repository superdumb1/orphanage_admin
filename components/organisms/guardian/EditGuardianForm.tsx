"use client";
import React, { useActionState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { updateGuardian } from "@/app/actions/guardian";
import Link from "next/link";

export default function EditGuardianForm({ guardian }: { guardian: any }) {
    // Bind the ID to the action for the server update
    const updateWithId = updateGuardian.bind(null, guardian._id);
    const [state, formAction, isPending] = useActionState(updateWithId as any, { error: null, success: false });

    return (
        <form 
            action={formAction} 
            className="bg-card p-8 md:p-10 rounded-dashboard shadow-glow border border-border flex flex-col gap-10 transition-all duration-500"
        >
            {/* ERROR ALERT: Swapped rose/zinc for danger semantic tokens */}
            {state?.error && (
                <div className="bg-danger/10 border border-danger/20 text-danger p-5 rounded-2xl text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                    ⚠️ Error: {state.error}
                </div>
            )}

            {/* SECTION: Personal Details */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] border-b border-border/50 pb-3 opacity-70">
                    Dossier: Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField label="Primary Name *" name="primaryName" defaultValue={guardian.primaryName} required />
                    <FormField label="Spouse / Partner Name" name="secondaryName" defaultValue={guardian.secondaryName} />
                    <FormField label="Email *" name="email" type="email" defaultValue={guardian.email} required />
                    <FormField label="Phone *" name="phone" defaultValue={guardian.phone} required />
                </div>
            </div>

            {/* SECTION: Vetting Details */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] border-b border-border/50 pb-3 opacity-70">
                    Vetting & Financial Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField label="Address *" name="address" defaultValue={guardian.address} required />
                    <FormField label="Occupation" name="occupation" defaultValue={guardian.occupation} />
                    <FormField label="Annual Income (NPR)" name="annualIncome" type="number" defaultValue={guardian.annualIncome} />
                    
                    <SelectField 
                        label="Applicant Type *" 
                        name="type" 
                        defaultValue={guardian.type}
                        options={[
                            { label: 'Foster Parent', value: 'FOSTER' },
                            { label: 'Adoptive Parent', value: 'ADOPTIVE' },
                            { label: 'Financial Sponsor', value: 'SPONSOR' }
                        ]}
                    />
                </div>
            </div>

            {/* ACTIONS: Synced with OrphanAdmin button logic */}
            <div className="flex justify-end items-center gap-6 pt-8 border-t border-border/50 mt-4">
                <Link 
                    href={`/guardians/${guardian._id}`} 
                    className="text-[10px] font-black text-text-muted hover:text-text uppercase tracking-[0.2em] transition-all"
                >
                    Discard Changes
                </Link>
                
                <Button 
                    type="submit" 
                    disabled={isPending} 
                    variant="primary"
                    className="px-12 h-12 shadow-glow"
                >
                    {isPending ? "Syncing Record..." : "Update Dossier"}
                </Button>
            </div>
        </form>
    );
}