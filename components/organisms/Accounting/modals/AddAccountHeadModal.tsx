"use client";
import React, { useActionState, useEffect, useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addAccountHead } from "@/app/actions/accounts";
import AddSubType from "../AccountsHead/AddSubType";

export const AddAccountHeadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isIncomeHead: boolean;
}> = ({ isOpen, onClose, isIncomeHead }) => {

    const [state, formAction, isPending] = useActionState(
        addAccountHead as any,
        { error: null, success: false }
    );

    const [subTypes, setSubTypes] = useState<string[]>([]);

    useEffect(() => {
        if (state?.success) {
            setSubTypes([]);
            onClose();
        }
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        // OVERLAY: Uses your bg-invert variable for a context-aware tint
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
            
            {/* SHELL: Updated bg-white -> bg-card, border-zinc-200 -> border-border, rounded-3xl -> rounded-dashboard */}
            <div className="bg-card rounded-dashboard shadow-glow w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border border-border animate-in zoom-in-95 transition-colors duration-500">

                {/* HEADER: bg-zinc-50 -> bg-shaded, border-b -> border-border */}
                <div className="p-6 md:px-8 border-b border-border bg-shaded flex justify-between items-center transition-colors">
                    <div>
                        {/* Typography: text-zinc-900 -> text-text */}
                        <h2 className="font-black text-xl text-text tracking-tight">
                            Register Account Head
                        </h2>
                        {/* Subtitle: text-zinc-500 -> text-text-muted */}
                        <p className="text-xs text-text-muted font-medium mt-0.5">
                            Define structured financial classification
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border hover:bg-card text-text-muted hover:text-text transition-all active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <form action={formAction} className="flex flex-col overflow-hidden">

                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                        {/* ERROR: text-red-600 -> text-danger, bg-red-50 -> bg-danger/10 */}
                        {state?.error && (
                            <p className="text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold transition-colors">
                                ⚠️ {state.error}
                            </p>
                        )}

                        {/* IDENTITY */}
                        <div className="grid grid-cols-2 gap-5">
                            <FormField
                                label="Account Name *"
                                name="name"
                                required
                                placeholder="e.g. Education Grant"
                                className="text-text"
                            />

                            <FormField
                                label="GL Code"
                                name="code"
                                placeholder="e.g. INC-1001"
                                className="text-text"
                            />
                        </div>

                        {/* CLASSIFICATION: bg-zinc-50 -> bg-shaded, border -> border-border */}
                        <div className="grid grid-cols-2 gap-5 bg-shaded p-6 rounded-2xl border border-border transition-colors">

                            <SelectField
                                id="type"
                                label="Root Type"
                                name="type"
                                required
                                options={[
                                    { label: "Asset", value: "ASSET" },
                                    { label: "Liability", value: "LIABILITY" },
                                    ...(isIncomeHead
                                        ? [{ label: "Income", value: "INCOME" }]
                                        : [{ label: "Expense", value: "EXPENSE" }]
                                    )
                                ]}
                            />

                            <SelectField
                                id="fundCategory"
                                label="Fund Governance"
                                name="fundCategory"
                                required
                                options={[
                                    { label: "Unrestricted", value: "UNRESTRICTED" },
                                    { label: "Restricted", value: "RESTRICTED" }
                                ]}
                            />
                        </div>

                        {/* SUB TYPES - Ensure this component also uses text-text internaly */}
                        <AddSubType subTypes={subTypes} setSubTypes={setSubTypes} />

                        <FormField
                            label="Description"
                            name="description"
                            placeholder="Optional notes for audit trail"
                            className="text-text"
                        />
                    </div>

                    {/* FOOTER: bg-white -> bg-card, border-t -> border-border */}
                    <div className="flex justify-end gap-3 p-6 md:px-8 border-t border-border bg-card shrink-0 transition-colors">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="text-text-muted hover:text-text hover:bg-shaded transition-colors"
                        >
                            Cancel
                        </Button>

                        {/* Submit Button: Replaced manual classes with your btn-primary utility */}
                        <Button
                            type="submit"
                            disabled={isPending || subTypes.length === 0}
                            className="btn-primary px-10 h-11"
                        >
                            {isPending ? "Saving..." : "Create Head"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};