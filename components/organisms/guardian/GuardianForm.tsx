import React, { useActionState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { createGuardian } from "@/app/actions/guardian";
type GuardianState = {
    error: string | null;
    success?: boolean;
};
const initialState: GuardianState = {
    error: null,
};

export const GuardianForm = () => {
    const [state, formAction, isPending] = useActionState(createGuardian as any, initialState);
    return (
        <form action={formAction} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center gap-4 border-b border-zinc-100 pb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl border border-blue-100">
                    🏠
                </div>
                <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Register Guardian / Foster Family</h2>
                    <p className="text-sm text-zinc-500">Initiate vetting for potential foster or adoptive parents.</p>
                </div>
            </div>

            {/* Optional Chaining to safely read the error */}
            {state?.error && (
                <p className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-bold">
                    ⚠️ {state.error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Primary Applicant Name" name="primaryName" required />
                <FormField label="Spouse / Secondary Name" name="secondaryName" />
                <FormField label="Email Address" name="email" type="email" required />
                <FormField label="Phone Number" name="phone" required />
                <div className="md:col-span-2">
                    <FormField label="Residential Address" name="address" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-zinc-50">
                <SelectField 
                    label="Vetting Status" 
                    name="vettingStatus" 
                    defaultValue="INQUIRY"
                    options={[
                        { label: 'Inquiry (सोधपुछ)', value: 'INQUIRY' },
                        { label: 'Under Vetting (जाँचबुझ)', value: 'VETTING' },
                        { label: 'Approved (स्वीकृत)', value: 'APPROVED' },
                        { label: 'Rejected (अस्वीकृत)', value: 'REJECTED' },
                        { label: 'Blacklisted (निषेधित)', value: 'BLACKLISTED' }
                    ]} 
                />
                <SelectField 
                    label="Applicant Type" 
                    name="type" 
                    required
                    options={[
                        { label: 'Foster Parent', value: 'FOSTER' },
                        { label: 'Adoptive Parent', value: 'ADOPTIVE' },
                        { label: 'Sponsor (सयोजक)', value: 'SPONSOR' }
                    ]} 
                />
                <FormField label="Annual Income (NPR)" name="annualIncome" type="number" />
            </div>

            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
                    📎 Background Verification Docs
                </h3>
                <p className="text-[11px] text-zinc-500 mb-4">Upload Police Clearance, Citizenship, and Marriage Certificates.</p>
                <input 
                    type="file" 
                    name="documents" 
                    multiple 
                    className="w-full text-xs text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-zinc-900 file:text-white hover:file:bg-zinc-800"
                />
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100">
                <Button type="submit" disabled={isPending} className="bg-zinc-900 text-white px-10">
                    {isPending ? "Processing..." : "Register Family"}
                </Button>
            </div>
        </form>
    );

};