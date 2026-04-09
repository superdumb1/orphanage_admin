"use client";
import React, { useState, useActionState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { createTransaction } from "@/app/actions/finance";

const incomeCategories = [
    { label: "General Donation (साधारण चन्दा)", value: "DONATION" },
    { label: "Child Sponsorship (प्रायोजन)", value: "SPONSORSHIP" },
    { label: "Government Grant (सरकारी अनुदान)", value: "GRANT" },
    { label: "Other Income (अन्य)", value: "OTHER" }
];

const initialState = { error: null as string | null };

export const IncomeForm = () => {
    const [state, formAction, isPending] = useActionState(createTransaction, initialState);
    const [method, setMethod] = useState("CASH");
    const isKind = method === "KIND";

    return (
        <form action={formAction} className="bg-white rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
            <input type="hidden" name="type" value="INCOME" />

            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl">↓</div>
                <div>
                    <h2 className="font-bold text-emerald-900 text-lg">Money In (आम्दानी)</h2>
                    <p className="text-xs text-emerald-700">Record a new donation or funding</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {state?.error && (
                    <div className="col-span-1 md:col-span-2 p-4 bg-red-50 text-red-700 font-medium rounded-lg border border-red-200">
                        ⚠️ {state.error}
                    </div>
                )}

                <FormField label="Amount Received (NPR)" name="amount" type="number" required min={0} />
                <FormField label="Date (मिति)" name="date" type="date" required />
                <SelectField label="Category (वर्ग)" name="category" required options={incomeCategories} />
                
                <SelectField 
                    label="Payment Method (माध्यम)" 
                    name="paymentMethod" 
                    required 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value)}
                    options={[
                        { label: "Cash (नगद)", value: "CASH" },
                        { label: "Bank Transfer / QR (बैंक)", value: "BANK" },
                        { label: "In-Kind / Physical Items (जिन्सी)", value: "KIND" }
                    ]} 
                />

                {isKind && (
                    <div className="col-span-1 md:col-span-2 p-4 bg-amber-50 rounded-lg border border-amber-200 animate-in fade-in">
                        <FormField label="Item Description (सामग्रीको विवरण)" name="itemDescription" required={isKind} placeholder="e.g. 50kg Rice, 10 Blankets..." />
                        <p className="text-xs text-amber-700 mt-2">* Enter an estimated cash value in the Amount field above for the ledger.</p>
                    </div>
                )}

                <div className="col-span-1 md:col-span-2 p-5 bg-zinc-50 rounded-lg border border-zinc-200 flex flex-col gap-4">
                    <h3 className="font-bold text-zinc-900 text-sm border-b pb-2">Donor Information (चन्दादाता)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Donor Name (नाम)" name="donorName" placeholder="Leave blank if unknown" />
                        <FormField label="Donor Phone (फोन)" name="donorPhone" type="tel" pattern="[0-9]{10}" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input type="checkbox" name="isAnonymous" className="accent-emerald-600 w-4 h-4" />
                        <span className="text-sm font-medium text-zinc-700">Keep Anonymous (गोप्य राख्नुहोस्)</span>
                    </label>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <FormField label="Remarks / Notes (कैफियत)" name="remarks" />
                </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
                <Button type="submit" disabled={isPending} className="text-white px-8 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                    {isPending ? "Saving..." : "Save Income Record"}
                </Button>
            </div>
        </form>
    );
};