"use client";
import React, { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { TAccountHead } from "@/types/Transaction";

interface FinanceBridgeProps {
    accounts: TAccountHead[];
    transaction: any;
}

export const StockFinanceFields: React.FC<FinanceBridgeProps> = ({
    accounts,
    transaction,
}) => {
    const [paymentMethod, setPaymentMethod] = useState(transaction?.paymentMethod || "CASH");
    const [costEntered, setCostEntered] = useState<number | string>(transaction?.amount || ""); 

    const expenseAccounts = accounts?.filter((acc) => acc.type === "EXPENSE") || [];
    const availableBanks = accounts?.filter((acc) => acc.isBankAccount) || [];

    return (
        <div className="bg-success/5 p-6 rounded-2xl border border-success/20 flex flex-col gap-6 transition-colors duration-500">

            <div className="border-b border-success/20 pb-3">
                <p className="text-[10px] uppercase font-black text-success tracking-[0.2em]">
                    Financial Link {transaction ? "— (Audit Active)" : "— (Optional Record)"}
                </p>
                <p className="text-[9px] text-text-muted uppercase font-bold mt-1 opacity-70">
                    Automatically syncs this entry to the ledger
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="Total Cost (NPR)"
                    name="cost"
                    type="number"
                    value={costEntered}
                    onChange={(e) => setCostEntered(e.target.value)} 
                    placeholder="Leave blank if donated"
                    className="text-text font-mono"
                />

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-black text-text-muted tracking-widest">
                        Expense Account Head
                    </label>
                    <select
                        name="accountHead"
                        defaultValue={transaction?.accountHead?._id?.toString() || transaction?.accountHead?.toString()}
                        className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                    >
                        <option value="">Auto-Assign to Staff Spend...</option>
                        {expenseAccounts.map((acc: any) => (
                            <option key={acc._id} value={acc._id.toString()}>
                                {acc.name} ({acc.code})
                            </option>
                        ))}
                    </select>
                    {/* ✨ Helpful UI Note */}
                    {Number(costEntered) > 0 && (
                        <span className="text-[9px] font-bold text-primary tracking-wider uppercase">
                            Leave blank to use default Staff Spend account.
                        </span>
                    )}
                </div>
            </div>

            {/* THE CRITICAL SETTLEMENT UPDATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-border/50">
                <div className="flex flex-col w-full">
                    <SelectField
                        id="paymentMethod"
                        label="Payment Method"
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        options={[
                            { label: "Cash (Orphanage Funds)", value: "CASH" },
                            { label: "Out of Pocket (My Personal Money)", value: "OUT_OF_POCKET" },
                            { label: "Bank Transfer", value: "BANK" },
                            { label: "Cheque", value: "CHEQUE" },
                            { label: "In-Kind (Donated)", value: "IN_KIND" }
                        ]}
                    />
                </div>

                <div className="flex flex-col w-full min-h-[70px]">
                    {(paymentMethod === "BANK" || paymentMethod === "CHEQUE") && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em] mb-2 block">
                                Source Bank Account *
                            </label>
                            <select
                                name="bankAccountId"
                                required
                                defaultValue={transaction?.bankAccountId?.toString() || ""}
                                className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                            >
                                <option value="">Select Bank...</option>
                                {availableBanks.map((bank: any) => (
                                    <option key={bank._id} value={bank._id.toString()}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <FormField
                    label="Transaction Date"
                    name="date"
                    type="date"
                    className="text-text color-scheme-adaptive font-mono"
                    defaultValue={
                        transaction?.date
                            ? new Date(transaction.date).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0]
                    }
                />
                <FormField
                    label="Vendor / Donor Name"
                    name="donorOrVendorName"
                    defaultValue={transaction?.donorOrVendorName}
                    placeholder="e.g. Local Market"
                    className="text-text"
                />
            </div>
            
            <FormField
                label="Reference / Cheque No."
                name="referenceNumber"
                defaultValue={transaction?.referenceNumber}
                placeholder="Optional"
                className="text-text"
            />
        </div>
    );
};