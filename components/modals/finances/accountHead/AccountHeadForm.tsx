"use client";
import React, { useActionState, useEffect, useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addAccountHead } from "@/app/actions/accounts";
import AddSubType from "../../../organisms/Accounting/AccountsHead/AddSubType";
import { Building2 } from "lucide-react"; // ✨ Added icon for visual flair

interface AccountHeadFormProps {
    closeModal: () => void;
    initialData?: any;
    defaultType?: string; 
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
    
    // ✨ NEW: State to toggle Bank details visibility
    const [isBankAccount, setIsBankAccount] = useState<boolean>(initialData?.isBankAccount || false);

    useEffect(() => {
        if (state?.success) closeModal();
    }, [state?.success, closeModal]);

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
                        label="GL Code *"
                        name="code"
                        required
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

                {/* ✨ NEW: BANK ACCOUNT TOGGLE & FIELDS */}
                <div className={`shrink-0 flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                    isBankAccount ? 'bg-primary/5 border-primary/30' : 'bg-card border-border'
                }`}>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${isBankAccount ? 'bg-primary/20 text-primary' : 'bg-shaded text-text-muted'}`}>
                                <Building2 size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-text uppercase tracking-widest">Liquid Asset / Bank Account</p>
                                <p className="text-[10px] text-text-muted font-bold mt-0.5">Enable if this account holds physical cash or bank deposits.</p>
                            </div>
                        </div>
                        {/* Hidden checkbox that actually submits the 'on' value */}
                        <input 
                            type="checkbox" 
                            name="isBankAccount" 
                            checked={isBankAccount} 
                            onChange={(e) => setIsBankAccount(e.target.checked)}
                            className="hidden" 
                        />
                        {/* Visual Custom Toggle */}
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isBankAccount ? 'bg-primary' : 'bg-border'}`}>
                            <div className={`bg-card w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${isBankAccount ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </label>

                    {/* Expandable Bank Details */}
                    {isBankAccount && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-primary/10 animate-in slide-in-from-top-2 fade-in">
                            <FormField
                                id="bankName"
                                label="Bank Name"
                                name="bankName"
                                placeholder="e.g. Nabil Bank"
                                className="text-text"
                                defaultValue={initialData?.bankDetails?.bankName || ""}
                                required={isBankAccount}
                            />
                            <FormField
                                id="accountNumber"
                                label="Account Number"
                                name="accountNumber"
                                placeholder="e.g. 123456789"
                                className="text-text font-mono"
                                defaultValue={initialData?.bankDetails?.accountNumber || ""}
                                required={isBankAccount}
                            />
                            <FormField
                                id="branch"
                                label="Branch Location"
                                name="branch"
                                placeholder="e.g. Birtamode"
                                className="text-text"
                                defaultValue={initialData?.bankDetails?.branch || ""}
                            />
                        </div>
                    )}
                </div>

                <FormField
                    id="description"
                    label="Description"
                    name="description"
                    placeholder="Optional notes for audit trail"
                    className="text-text shrink-0 pb-4"
                    defaultValue={initialData?.description || ""}
                />
            </div>

            <div className="shrink-0 flex justify-end gap-3.5 pt-6 border-t border-border bg-card mt-2">
                <Button type="button" variant="ghost" onClick={closeModal} className="text-text-muted hover:text-text hover:bg-shaded font-bold text-xs uppercase tracking-wider">
                    CANCEL
                </Button>
                {/* Minor fix: Removed the `subTypes.length === 0` disable check so you don't HAVE to have a subType to save an account */}
                <Button type="submit" disabled={isPending} className="px-8 font-black text-xs uppercase tracking-widest text-text-invert bg-primary hover:bg-primary/90 shadow-glow active:scale-95 transition-all h-11">
                    {isPending ? "PROCESSING..." : (initialData ? "UPDATE HEAD" : "SAVE HEAD")}
                </Button>
            </div>
        </form>
    );
};