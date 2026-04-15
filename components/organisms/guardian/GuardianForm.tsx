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
            // Updated Container: bg-white -> bg-card, border-zinc-200 -> border-border
            className="bg-card p-8 rounded-dashboard shadow-glow border border-border flex flex-col gap-6 max-w-4xl transition-colors duration-500"
        >
            {/* HEADER: Updated border-zinc-100 -> border-border */}
            <div className="flex items-center gap-6 border-b border-border pb-6">

                {/* AVATAR */}
                <div className="relative w-16 h-16 shrink-0 group cursor-pointer">

                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Profile Preview"
                            // Updated border-zinc-200 -> border-border
                            className="w-full h-full object-cover rounded-2xl border border-border shadow-sm"
                        />
                    ) : (
                        // Updated Empty Avatar: bg-zinc-50 -> bg-shaded
                        <div className="w-full h-full bg-shaded text-text-muted/50 rounded-2xl flex items-center justify-center text-2xl border border-border shadow-inner grayscale">
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

                    {/* Updated Mini-Badge: bg-white -> bg-card, border-zinc-200 -> border-border */}
                    <div className="absolute -bottom-2 -right-2 bg-card border border-border rounded-full w-7 h-7 flex items-center justify-center text-[10px] shadow-sm transition-colors">
                        📷
                    </div>
                </div>

                <div>
                    {/* Updated Typography: text-zinc-900 -> text-text, text-zinc-500 -> text-text-muted */}
                    <h2 className="text-xl font-black text-text tracking-tight">
                        Register Guardian / Foster Family
                    </h2>
                    <p className="text-sm text-text-muted mt-0.5">
                        Initiate vetting for foster or adoptive parents
                    </p>
                </div>
            </div>

            {/* ERROR: Updated bg-rose-50 -> bg-danger/10, text-rose-600 -> text-danger */}
            {state?.error && (
                <p className="p-4 bg-danger/10 text-danger rounded-xl text-sm border border-danger/20 font-bold transition-colors">
                    ⚠ {state.error}
                </p>
            )}

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Primary Applicant Name" name="primaryName" required className="text-text" />
                <FormField label="Spouse / Secondary Name" name="secondaryName" className="text-text" />
                <FormField label="Email Address" name="email" type="email" required className="text-text" />
                <FormField label="Phone Number" name="phone" required className="text-text" />

                <div className="md:col-span-2">
                    <FormField label="Residential Address" name="address" required className="text-text" />
                </div>
            </div>

            {/* CLASSIFICATION: Updated border-zinc-100 -> border-border */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">

                <SelectField
                    label="Vetting Status"
                    name="vettingStatus"
                    defaultValue="INQUIRY"
                    className="text-text"
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
                    className="text-text"
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
                    className="text-text"
                />
            </div>

            {/* DOCUMENTS: Updated bg-zinc-50 -> bg-shaded, border-zinc-200 -> border-border */}
            <div className="bg-shaded p-6 rounded-xl border border-border transition-colors">
                <h3 className="text-sm font-bold text-text mb-1 flex items-center gap-2">
                    📎 Background Verification Docs
                </h3>

                <p className="text-[11px] text-text-muted mb-4 font-medium">
                    Police clearance, citizenship, marriage certificates
                </p>

                <input
                    type="file"
                    name="documents"
                    multiple
                    // Updated file button to use primary brand colors
                    className="w-full text-xs text-text-muted file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:bg-primary file:text-text-invert file:font-bold hover:file:opacity-90 transition-all cursor-pointer"
                />
            </div>

            {/* ACTIONS: Updated border-zinc-100 -> border-border */}
            <div className="flex justify-end pt-4 border-t border-border">
                {/* Updated Button to use your utility class */}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary w-full sm:w-auto px-10"
                >
                    {isPending ? "Processing..." : "Register Family"}
                </Button>
            </div>
        </form>
    );
};