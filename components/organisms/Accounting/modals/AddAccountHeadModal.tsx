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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200">

                {/* HEADER */}
                <div className="p-6 border-b bg-zinc-50 flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-xl text-zinc-900">
                            Register Account Head
                        </h2>
                        <p className="text-xs text-zinc-500">
                            Define structured financial classification
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-900"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <form action={formAction} className="flex flex-col overflow-hidden">

                    <div className="p-6 flex flex-col gap-6 overflow-y-auto">

                        {state?.error && (
                            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">
                                ⚠️ {state.error}
                            </p>
                        )}

                        {/* IDENTITY */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Account Name *"
                                name="name"
                                required
                                placeholder="e.g. Education Grant"
                            />

                            <FormField
                                label="GL Code"
                                name="code"
                                placeholder="e.g. INC-1001"
                            />
                        </div>

                        {/* CLASSIFICATION */}
                        <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-5 rounded-2xl border">

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

                        {/* SUB TYPES */}
                        <AddSubType subTypes={subTypes} setSubTypes={setSubTypes} />

                        <FormField
                            label="Description"
                            name="description"
                            placeholder="Optional notes for audit trail"
                        />
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 p-6 border-t bg-white">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending || subTypes.length === 0}
                            className="bg-zinc-900 text-white font-black px-10"
                        >
                            {isPending ? "Saving..." : "Create Head"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};