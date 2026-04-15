"use client";

import React, { useActionState, useEffect, useState } from "react";
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

export const GuardianForm = ({ onClose }: { onClose: () => void }) => {
    const [state, formAction, isPending] = useActionState(
        createGuardian as any,
        initialState
    );

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreviewImage(URL.createObjectURL(file));
        else setPreviewImage(null);
    };

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    return (
        <form
            action={formAction}
            className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-6 max-w-4xl"
        >
            {/* HEADER */}
            <div className="flex items-center gap-5 border-b border-zinc-100 pb-6">

                {/* AVATAR */}
                <div className="relative w-16 h-16 shrink-0 group cursor-pointer">

                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Profile Preview"
                            className="w-full h-full object-cover rounded-2xl border border-zinc-200"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-50 text-zinc-400 rounded-2xl flex items-center justify-center text-2xl border border-zinc-200">
                            👤
                        </div>
                    )}

                    <input
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />

                    <div className="absolute -bottom-2 -right-2 bg-white border border-zinc-200 rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow-sm">
                        📷
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                        Register Guardian / Foster Family
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Initiate vetting for foster or adoptive parents
                    </p>
                </div>
            </div>

            {/* ERROR */}
            {state?.error && (
                <p className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100 font-bold">
                    ⚠ {state.error}
                </p>
            )}

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Primary Applicant Name" name="primaryName" required />
                <FormField label="Spouse / Secondary Name" name="secondaryName" />
                <FormField label="Email Address" name="email" type="email" required />
                <FormField label="Phone Number" name="phone" required />

                <div className="md:col-span-2">
                    <FormField label="Residential Address" name="address" required />
                </div>
            </div>

            {/* CLASSIFICATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-zinc-100">

                <SelectField
                    label="Vetting Status"
                    name="vettingStatus"
                    defaultValue="INQUIRY"
                    options={[
                        { label: "Inquiry", value: "INQUIRY" },
                        { label: "Vetting", value: "VETTING" },
                        { label: "Approved", value: "APPROVED" },
                        { label: "Rejected", value: "REJECTED" },
                        { label: "Blacklisted", value: "BLACKLISTED" }
                    ]}
                />

                <SelectField
                    label="Applicant Type"
                    name="type"
                    required
                    options={[
                        { label: "Foster Parent", value: "FOSTER" },
                        { label: "Adoptive Parent", value: "ADOPTIVE" },
                        { label: "Sponsor", value: "SPONSOR" }
                    ]}
                />

                <FormField
                    label="Annual Income (NPR)"
                    name="annualIncome"
                    type="number"
                />
            </div>

            {/* DOCUMENTS */}
            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
                    📎 Background Verification Docs
                </h3>

                <p className="text-[11px] text-zinc-500 mb-4">
                    Police clearance, citizenship, marriage certificates
                </p>

                <input
                    type="file"
                    name="documents"
                    multiple
                    className="w-full text-xs text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-zinc-900 file:text-white hover:file:bg-zinc-800"
                />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end pt-4 border-t border-zinc-100">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-zinc-900 text-white px-10 font-bold"
                >
                    {isPending ? "Processing..." : "Register Family"}
                </Button>
            </div>
        </form>
    );
};