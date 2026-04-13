"use client";
import React, { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addTransaction } from "@/app/actions/transactions";
import { TTransaction } from "@/types/Transaction";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: any[];
    transaction?: TTransaction;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, accounts, transaction }) => {
    const [state, formAction, isPending] = useActionState(addTransaction as any, { error: null, success: false });
    
    const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    const selectedAccount = accounts.find(acc => acc._id === selectedAccountId);
    const availableSubTypes = selectedAccount?.subType || [];

    const filteredAccounts = accounts.filter(acc => acc.type === transactionType);
    const accountOptions = filteredAccounts.map(acc => ({
        label: `${acc.name} (${acc.code})`,
        value: acc._id
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200 animate-in zoom-in-95">
                <Header onClose={onClose} transactionType={transactionType} />
                <form action={formAction} className="flex flex-col overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
                        {state?.error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">⚠️ {state.error}</p>}
                        <div className="flex bg-zinc-100 p-1 rounded-xl shrink-0">
                            <button
                                type="button"
                                onClick={() => setTransactionType('EXPENSE')}
                                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${transactionType === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                EXPENSE (Out)
                            </button>
                            <button
                                type="button"
                                onClick={() => setTransactionType('INCOME')}
                                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${transactionType === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                INCOME (In)
                            </button>
                        </div>
                        <input type="hidden" name="type" value={transactionType} />
                        <CoreDetails setSelectedAccountId={setSelectedAccountId} selectedAccountId={selectedAccountId} availableSubTypes={availableSubTypes} filteredAccounts={filteredAccounts} />
                        <ContextRow />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label={`${transactionType === "EXPENSE" ? "" : "Donor /"} Vendor Name`} name="donorOrVendorName" placeholder="e.g. John Doe / Nepal Electricity" />
                            <FormField label="Reference / Cheque No." name="referenceNumber" placeholder="Optional" />
                        </div>
                        <FormField label="Description *" name="description" required placeholder="What was this transaction for?" />
                    </div>
                    <Footer isPending={isPending} accountOptions={accountOptions} onClose={onClose} transactionType={transactionType} />
                </form>
            </div>
        </div>
    )
};
const Header: React.FC<{ onClose: () => void, transactionType: "INCOME" | "EXPENSE" }> = ({ onClose, transactionType }) => {

    return (<div className={`p-6 md:p-8 border-b border-zinc-100 shrink-0 flex justify-between items-center ${transactionType === 'INCOME' ? 'bg-emerald-50/50' : 'bg-rose-50/50'}`}>
        <div>
            <h2 className="font-black text-zinc-900 text-xl tracking-tighter">Record Transaction</h2>
            <p className="text-xs text-zinc-500 font-medium">Log a new income or expense to the ledger.</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-400 transition-colors">✕</button>
    </div>)
}


const CoreDetails: React.FC<{ selectedAccountId: string, setSelectedAccountId: Dispatch<SetStateAction<string>>, filteredAccounts: any, availableSubTypes: any }> = ({ selectedAccountId, setSelectedAccountId, filteredAccounts, availableSubTypes }) => {
    return (
        <div className="grid bg-zinc-50 rounded p-5 grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Amount (NPR) *" name="amount" type="number" required placeholder="e.g. 5000" />

            <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-black tracking-widest">Account Head *</label>
                <select
                    name="accountHead"
                    required
                    className=" text-black w-full p-3 text-sm border border-zinc-200 rounded-xl  outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    value={selectedAccountId}
                >
                    <option value="" disabled>Select...</option>
                    {filteredAccounts.map((acc: any) => (
                        <option key={acc._id} value={acc._id}>{acc.name} ({acc.code})</option>
                    ))}
                </select>
            </div>
            {availableSubTypes.length > 0 && (
                <SelectField label="Head Sub-Type" options={availableSubTypes.map((t: string) => ({ label: t, value: t }))} />
            )}
        </div>
    )
}


const ContextRow = ({ }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
            <SelectField
                label="Payment Method"
                name="paymentMethod"
                options={[
                    { label: 'Cash', value: 'CASH' },
                    { label: 'Bank Transfer', value: 'BANK' },
                    { label: 'Cheque', value: 'CHEQUE' },
                ]}
            />
            <FormField label="Date" name="date" type="date" required />
        </div>
    )
}

const Footer: React.FC<{ isPending: any, accountOptions: any, onClose: () => void, transactionType: any }> = ({ isPending, accountOptions, onClose, transactionType }) => {
    return (
        <div className="flex justify-end gap-3 p-6 border-t border-zinc-100 bg-white shrink-0 rounded-b-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <Button type="button" variant="ghost" onClick={onClose} className="px-6 font-bold text-zinc-500">Cancel</Button>
            <Button
                type="submit"
                disabled={isPending || accountOptions.length === 0}
                className={`font-black px-12 shadow-lg ${transactionType === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'}`}
            >
                {isPending ? "Saving..." : "Record Transaction"}
            </Button>
        </div>
    )
}