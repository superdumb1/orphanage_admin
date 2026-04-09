"use client";
import React, { useActionState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { createTransaction } from "@/app/actions/finance";

const expenseCategories = [
    { label: "Groceries & Food (राशन)", value: "GROCERY" },
    { label: "Medical & Health (स्वास्थ्य)", value: "MEDICAL" },
    { label: "Education (शिक्षा)", value: "EDUCATION" },
    { label: "Utilities (बिजुली/पानी)", value: "UTILITIES" },
    { label: "Staff Payroll (तलब)", value: "PAYROLL" },
    { label: "Maintenance (मर्मत)", value: "MAINTENANCE" },
    { label: "Other Expense (अन्य)", value: "OTHER" }
];

const initialState = { error: null as string | null };

export const ExpenseForm = () => {
    const [state, formAction, isPending] = useActionState(createTransaction, initialState);

    return (
        <form action={formAction} className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
            <input type="hidden" name="type" value="EXPENSE" />

            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl">↑</div>
                <div>
                    <h2 className="font-bold text-red-900 text-lg">Money Out (खर्च)</h2>
                    <p className="text-xs text-red-700">Record a new orphanage expense</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {state?.error && (
                    <div className="col-span-1 md:col-span-2 p-4 bg-red-50 text-red-700 font-medium rounded-lg border border-red-200">
                        ⚠️ {state.error}
                    </div>
                )}

                <FormField label="Amount Spent (NPR)" name="amount" type="number" required min={0} />
                <FormField label="Date (मिति)" name="date" type="date" required />
                <SelectField label="Category (वर्ग)" name="category" required options={expenseCategories} />
                
                <SelectField 
                    label="Payment Method (माध्यम)" 
                    name="paymentMethod" 
                    required 
                    options={[
                        { label: "Cash (नगद)", value: "CASH" },
                        { label: "Bank Transfer / Cheque (बैंक)", value: "BANK" }
                    ]} 
                />

                <div className="col-span-1 md:col-span-2">
                    <FormField 
                        label="Remarks / Receipt Ref (कैफियत)" 
                        name="remarks" 
                        placeholder="e.g. Bought 50kg Rice from Market, Bill No. 1024" 
                        required 
                    />
                </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
                <Button type="submit" disabled={isPending} className="text-white px-8 bg-red-600 hover:bg-red-700 disabled:opacity-50">
                    {isPending ? "Recording..." : "Record Expense"}
                </Button>
            </div>
        </form>
    );
};