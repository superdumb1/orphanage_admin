"use client";
import React from "react";
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
    // Filter only expense accounts for inventory purchases
    const expenseAccounts = accounts.filter(
        (acc) => acc.type === "EXPENSE"
    );

    return (
        // Wrapper: Swapped hardcoded emerald for success variable with opacity
        <div className="bg-success/5 p-6 rounded-2xl border border-success/20 flex flex-col gap-6 transition-colors duration-500">

            {/* SECTION HEADER */}
            <div className="border-b border-success/20 pb-3">
                {/* Typography: Micro-caps aesthetic using success token */}
                <p className="text-[10px] uppercase font-black text-success tracking-[0.2em]">
                    Financial Link {transaction ? "— (Audit Active)" : "— (Optional Record)"}
                </p>
                <p className="text-[9px] text-text-muted uppercase font-bold mt-1 opacity-70">
                    Automatically syncs this entry to the ledger
                </p>
            </div>

            {/* Core Financials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="Total Cost (NPR)"
                    name="cost"
                    type="number"
                    defaultValue={transaction?.amount}
                    placeholder="Leave blank if donated"
                    className="text-text"
                />

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-black text-text-muted tracking-widest">
                        Expense Account Head
                    </label>
                    <select
                        name="accountHead"
                        defaultValue={transaction?.accountHead?._id?.toString()}
                        className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                    >
                        <option value="">Select Account...</option>
                        {expenseAccounts.map((acc: any) => (
                            <option key={acc._id} value={acc._id.toString()}>
                                {acc.name} ({acc.code})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SelectField
                    label="Payment Method"
                    name="paymentMethod"
                    defaultValue={transaction?.paymentMethod || "CASH"}
                    options={[
                        { label: "Cash", value: "CASH" },
                        { label: "Bank Transfer", value: "BANK" },
                        { label: "Cheque", value: "CHEQUE" },
                    ]}
                />

                <FormField
                    label="Transaction Date"
                    name="date"
                    type="date"
                    className="text-text color-scheme-adaptive"
                    defaultValue={
                        transaction?.date
                            ? new Date(transaction.date)
                                  .toISOString()
                                  .split("T")[0]
                            : new Date().toISOString().split("T")[0]
                    }
                />
            </div>

            {/* Extra Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                    label="Vendor / Donor Name"
                    name="donorOrVendorName"
                    defaultValue={transaction?.donorOrVendorName}
                    placeholder="e.g. Local Market"
                    className="text-text"
                />
                <FormField
                    label="Reference / Cheque No."
                    name="referenceNumber"
                    defaultValue={transaction?.referenceNumber}
                    placeholder="Optional"
                    className="text-text"
                />
            </div>
        </div>
    );
};