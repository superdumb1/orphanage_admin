"use client";
import React, { useActionState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { updateGuardian } from "@/app/actions/guardian";
import Link from "next/link";

export default function EditGuardianForm({ guardian }: { guardian: any }) {
    // Bind the ID to the action so we know exactly who we are updating
    const updateWithId = updateGuardian.bind(null, guardian._id);
    const [state, formAction, isPending] = useActionState(updateWithId as any, { error: null, success: false });

    return (
        <form action={formAction} className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-200 flex flex-col gap-8">
            
            {state?.error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm font-bold">
                    ⚠️ {state.error}
                </div>
            )}

            {/* Core Details */}
            <div>
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2 mb-4">
                    Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Primary Name *" name="primaryName" defaultValue={guardian.primaryName} required />
                    <FormField label="Spouse / Partner Name" name="secondaryName" defaultValue={guardian.secondaryName} />
                    <FormField label="Email *" name="email" type="email" defaultValue={guardian.email} required />
                    <FormField label="Phone *" name="phone" defaultValue={guardian.phone} required />
                </div>
            </div>

            {/* Vetting Details */}
            <div>
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2 mb-4">
                    Vetting & Financial Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-zinc-100">
                <Link href={`/guardians/${guardian._id}`} className="px-6 py-3 font-bold text-zinc-500 hover:text-zinc-800 transition-colors">
                    Cancel
                </Link>
                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 shadow-lg shadow-blue-200">
                    {isPending ? "Saving Changes..." : "Save Profile"}
                </Button>
            </div>
        </form>
    );
}