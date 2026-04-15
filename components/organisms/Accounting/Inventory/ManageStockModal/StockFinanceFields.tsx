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
  const expenseAccounts = accounts.filter((acc) => acc.type === "EXPENSE");

  return (
    // WRAPPER: Swapped emerald for bg-success/5 and border-success/20 for a premium themed tint
    <div className="bg-success/5 p-6 rounded-2xl border border-success/20 flex flex-col gap-6 animate-in fade-in zoom-in-95 transition-colors duration-500">

      {/* HEADER: Uses success color variable for semantic meaning */}
      <div className="border-b border-success/20 pb-3">
        <p className="text-[10px] uppercase font-black text-success tracking-[0.2em]">
          Financial Link {transaction ? "— (Audit Active)" : "— (Optional Record)"}
        </p>
        <p className="text-[9px] text-text-muted uppercase font-bold mt-1 opacity-60">
          Syncs this stock entry to your financial ledger
        </p>
      </div>

      {/* CORE FINANCIALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          label="Total Cost (NPR)"
          name="cost"
          type="number"
          defaultValue={transaction?.amount}
          placeholder="Leave blank if donated"
          className="text-text"
        />

        {/* ACCOUNT SELECT: Synced with OrphanAdmin input tokens */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-black text-text-muted tracking-widest">
            Expense Account
          </label>

          <select
            name="accountHead"
            defaultValue={transaction?.accountHead?._id?.toString()}
            className="
              w-full p-3 text-sm font-bold
              border border-border rounded-xl
              bg-bg text-text
              outline-none
              focus:ring-2 focus:ring-primary
              transition-all cursor-pointer
            "
          >
            <option value="" className="opacity-50">
              Select Account Head...
            </option>

            {expenseAccounts.map((acc: any) => (
              <option key={acc._id.toString()} value={acc._id.toString()}>
                {acc.name} ({acc.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PAYMENT + DATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SelectField
          label="Payment Method"
          name="paymentMethod"
          className="text-text"
          defaultValue={transaction?.paymentMethod || "CASH"}
          options={[
            { label: "Cash", value: "CASH" },
            { label: "Bank Transfer", value: "BANK" },
            { label: "Cheque", value: "CHEQUE" },
          ]}
        />

        <FormField
          label="Date of Purchase"
          name="date"
          type="date"
          className="text-text color-scheme-adaptive"
          defaultValue={
            transaction?.date
              ? new Date(transaction.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
        />
      </div>

      {/* EXTRA INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          label="Vendor / Donor Name"
          name="donorOrVendorName"
          className="text-text"
          defaultValue={transaction?.donorOrVendorName}
          placeholder="e.g. Local Market"
        />

        <FormField
          label="Reference / Cheque No."
          name="referenceNumber"
          className="text-text"
          defaultValue={transaction?.referenceNumber}
          placeholder="Optional"
        />
      </div>
    </div>
  );
};