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
    defaultType?: string; // ✨ NEW: Allows accordion to pre-fill the root type
}

export const AccountHeadForm: React.FC<AccountHeadFormProps> = ({
    closeModal,
    initialData,
    defaultType
}) => {
    const [state, formAction, isPending] = useActionState(
        addAccountHead as any,
        { error: null, success: false }
    );

    const [subTypes, setSubTypes] = useState<string[]>(initialData?.subType || []);

    useEffect(() => {
        if (state?.success) closeModal();
    }, [state?.success, closeModal]);

    return (
        <form action={formAction} className="flex flex-col flex-1 min-h-0 w-full">
            {/* HIDDEN ID FOR UPDATES */}
            {initialData?._id && <input type="hidden" name="id" value={initialData._id} />}

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-6">

                {state?.error && (
                    <div className="flex items-center gap-3 text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold animate-in slide-in-from-top-2 shrink-0">
                        <span className="text-lg">⚠️</span>
                        <span>{state.error}</span>
                    </div>
                )}

                {/* ✨ THE FIX: Name changed to 'subType' to match the server action exactly */}
                {subTypes.map((st, index) => (
                    <input key={`st-${index}`} type="hidden" name="subType" value={st} />
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0">
                    <FormField
                        id="name"
                        label="Account Name *"
                        name="name"
                        required
                        placeholder="e.g. Education Grant"
                        className="text-text"
                        defaultValue={initialData?.name || ""}
                    />
                    <FormField
                        id="code"
                        label="GL Code"
                        name="code"
                        placeholder="e.g. INC-1001"
                        className="text-text font-mono uppercase"
                        defaultValue={initialData?.code || ""}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-shaded p-6 rounded-2xl border border-border transition-colors shrink-0">
                    <SelectField
                        id="type"
                        label="Root Type *"
                        name="type"
                        required
                        className="text-text"
                        // ✨ Uses initialData first, then defaultType passed from Accordion, then falls back to INCOME
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
                        label="Fund Governance"
                        name="fundCategory"
                        required
                        className="text-text"
                        defaultValue={initialData?.fundCategory || "UNRESTRICTED"}
                        options={[
                            { label: "Unrestricted", value: "UNRESTRICTED" },
                            { label: "Restricted", value: "RESTRICTED" }
                        ]}
                    />
                </div>

                <div className="shrink-0">
                    <AddSubType subTypes={subTypes} setSubTypes={setSubTypes} />
                </div>

                <FormField
                    id="description"
                    label="Description"
                    name="description"
                    placeholder="Optional notes for audit trail"
                    className="text-text shrink-0"
                    defaultValue={initialData?.description || ""}
                />
            </div>

            <div className="shrink-0 flex justify-end gap-3.5 pt-6 border-t border-border bg-card mt-2">
                <Button type="button" variant="ghost" onClick={closeModal} className="text-text-muted hover:text-text hover:bg-shaded font-bold text-xs uppercase tracking-wider">
                    CANCEL
                </Button>
                <Button type="submit" disabled={isPending || subTypes.length === 0} className="px-8 font-black text-xs uppercase tracking-widest text-text-invert bg-primary hover:bg-primary/90 shadow-glow active:scale-95 transition-all h-11">
                    {isPending ? "PROCESSING..." : (initialData ? "UPDATE HEAD" : "SAVE HEAD")}
                </Button>
            </div>
        </form>
    );
};