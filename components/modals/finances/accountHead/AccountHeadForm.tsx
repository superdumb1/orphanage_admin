"use client";
import React, { useActionState, useEffect, useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addAccountHead } from "@/app/actions/accounts";
import AddSubType from "../../../organisms/Accounting/AccountsHead/AddSubType";

interface AccountHeadFormProps {
    closeModal: () => void;
    initialData?: any;
    defaultType?: string;
    onSaved?: () => void;
}

export const AccountHeadForm: React.FC<AccountHeadFormProps> = ({
    closeModal,
    initialData,
    defaultType,
    onSaved
}) => {
    const [state, formAction, isPending] = useActionState(
        addAccountHead as any,
        { error: null, success: false }
    );

    const [subTypes, setSubTypes] = useState<string[]>(initialData?.subType || []);


    useEffect(() => {
        if (state?.success) {
            if (onSaved) onSaved();
            closeModal();
        }
    }, [state?.success, closeModal, onSaved]);

    return (
        <form action={formAction} className="flex flex-col flex-1 min-h-0 w-full">
            {initialData?._id && <input type="hidden" name="id" value={initialData._id} />}

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-6">

                {state?.error && (
                    <div className="flex items-center gap-3 text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold animate-in slide-in-from-top-2 shrink-0">
                        <span className="text-lg">⚠️</span>
                        <span>{state.error}</span>
                    </div>
                )}

                {/* Hidden inputs for SubTypes to ensure they are submitted with the formAction */}
                {subTypes.map((st, index) => (
                    <input key={`st-${index}`} type="hidden" name="subType" value={st} />
                ))}

                {/* 01. IDENTITY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0">
                    <FormField
                        id="name"
                        label="Account Name *"
                        name="name"
                        required
                        placeholder="e.g. Education Grant"
                        defaultValue={initialData?.name || ""}
                    />
                    <FormField
                        id="code"
                        label="GL Code *"
                        name="code"
                        required
                        placeholder="e.g. INC-1001"
                        className="font-mono uppercase"
                        defaultValue={initialData?.code || ""}
                    />
                </div>

                {/* 02. GOVERNANCE & TYPE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-shaded p-6 rounded-2xl border border-border shrink-0">
                    <SelectField
                        id="type"
                        label="Root Type *"
                        name="type"
                        required
                        defaultValue={initialData?.type || defaultType || "INCOME"}
                        options={[
                            { label: "Asset", value: "ASSET" },
                            { label: "Liability", value: "LIABILITY" },
                            { label: "Income", value: "INCOME" },
                            { label: "Expense", value: "EXPENSE" }
                        ]}
                    />
                    <SelectField
                        id="fundCategory"
                        label="Fund Governance *"
                        name="fundCategory"
                        required
                        defaultValue={initialData?.fundCategory || "UNRESTRICTED"}
                        options={[
                            { label: "Unrestricted", value: "UNRESTRICTED" },
                            { label: "Restricted", value: "RESTRICTED" }
                        ]}
                    />
                </div>

                {/* 03. SUB-TYPES MANAGEMENT */}
                <div className="shrink-0">
                    <AddSubType subTypes={subTypes} setSubTypes={setSubTypes} />
                </div>

                {/* 04. ADDITIONAL INFO */}
                <FormField
                    id="description"
                    label="Description"
                    name="description"
                    placeholder="Optional notes for audit trail"
                    className="shrink-0 pb-4"
                    defaultValue={initialData?.description || ""}
                />
            </div>

            {/* ACTION BAR */}
            <div className="shrink-0 flex justify-end gap-3.5 pt-6 border-t border-border bg-card mt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={closeModal}
                    className="text-text-muted hover:text-text hover:bg-shaded font-bold text-xs uppercase tracking-wider"
                >
                    CANCEL
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="px-8 font-black text-xs uppercase tracking-widest text-text-invert bg-primary hover:bg-primary/90 shadow-glow active:scale-95 transition-all h-11"
                >
                    {isPending ? "PROCESSING..." : (initialData ? "UPDATE HEAD" : "SAVE HEAD")}
                </Button>
            </div>
        </form>
    );
};