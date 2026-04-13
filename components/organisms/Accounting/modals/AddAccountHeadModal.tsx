"use client";
import React, { useActionState, useEffect, useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addAccountHead } from "@/app/actions/accounts";
import AddSubType from "../AccountsHead/AddSubType";

export const AddAccountHeadModal: React.FC<{ isOpen: boolean, onClose: () => void, isIncomeHead: boolean }> = ({ isOpen, onClose, isIncomeHead }) => {
    const [state, formAction, isPending] = useActionState(addAccountHead as any, { error: null, success: false });

    // 🔥 New State for Fund Governance
    const [selectedCategory, setSelectedCategory] = useState<'UNRESTRICTED' | 'RESTRICTED'>('UNRESTRICTED');
    const [subTypes, setSubTypes] = useState<string[]>([]);

    useEffect(() => {
        if (state?.success) {
            setSubTypes([]);
            setSelectedCategory('UNRESTRICTED'); // Reset on success
            onClose();
        }
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* 1. Container: flex flex-col and max-h-[90vh] */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200 animate-in zoom-in-95">

                {/* 2. Header: shrink-0 so it stays pinned */}
                <div className="p-6 md:p-8 border-b border-zinc-100 bg-zinc-50/50 shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-zinc-900 text-xl tracking-tighter">Register Account Head</h2>
                        <p className="text-xs text-zinc-500 font-medium">Classify your organizational cashflow accurately.</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-400 transition-colors">✕</button>
                </div>

                {/* 3. Form: flexible container */}
                <form action={formAction} className="flex flex-col overflow-hidden">
                    
                    {/* 4. Scrollable Content Area: overflow-y-auto */}
                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
                        {state?.error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">⚠️ {state.error}</p>}

                        {/* ROW 1: Identity */}
                        <div className="grid grid-cols-2 gap-6">
                            <FormField label="Account Name *" name="name" required placeholder="e.g. Monthly Sponsorship" />
                            <FormField label="GL Code" name="code" placeholder="e.g. 1001-INC" />
                        </div>

                        {/* ROW 2: Classification Side-by-Side */}
                        <div className="grid grid-cols-2 gap-6 bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                            {/* 1. Root Type Selection */}
                            <RootTypeOptions isIncomeHead={isIncomeHead} />

                            {/* 2. Fund Governance */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">
                                    Fund Governance
                                </label>
                                <div className="flex gap-2 p-1 bg-white border border-zinc-200 rounded-xl h-[42px]">
                                    {['UNRESTRICTED', 'RESTRICTED'].map((cat) => (
                                        <label
                                            key={cat}
                                            className={`flex-1 flex items-center justify-center text-[9px] font-black tracking-tighter rounded-lg cursor-pointer transition-all ${selectedCategory === cat
                                                    ? 'bg-zinc-900 text-white shadow-sm'
                                                    : 'text-zinc-900 hover:text-zinc-600'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="fundCategory"
                                                value={cat}
                                                className="hidden"
                                                onChange={() => setSelectedCategory(cat as any)}
                                                checked={selectedCategory === cat}
                                            />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <AddSubType subTypes={subTypes} setSubTypes={setSubTypes} />

                        <FormField label="Memo / Description" name="description" placeholder="Optional notes for the auditor..." />
                    </div>

                    {/* 5. Footer: shrink-0 so it stays pinned to the bottom */}
                    <div className="flex justify-end gap-3 p-6 border-t border-zinc-100 bg-white shrink-0 rounded-b-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                        <Button type="button" variant="ghost" onClick={onClose} className="px-6 font-bold text-zinc-500">Cancel</Button>
                        <Button
                            type="submit"
                            disabled={isPending || subTypes.length === 0}
                            className="bg-zinc-900 text-white font-black px-12 shadow-lg shadow-zinc-200"
                        >
                            {isPending ? "Processing..." : "Finalize Account Head"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};  

const RootTypeOptions: React.FC<{ isIncomeHead: boolean }> = ({ isIncomeHead }) => {
    return (
        <SelectField
            label="Root Type"
            name="type"
            required
            options={
                [
                    { label: 'Asset (सम्पत्ति)', value: 'ASSET' },
                    { label: 'Liability (दायित्व)', value: 'LIABILITY' },
                    ...(isIncomeHead ? [{ label: 'Income (आम्दानी)', value: 'INCOME' }] : [{ label: 'Expense (खर्च)', value: 'EXPENSE' }])
                ]}
        />
    )
}