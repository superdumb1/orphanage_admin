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
    <div className="bg-emerald-50/30 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex flex-col gap-5 animate-in fade-in zoom-in-95">

      {/* HEADER */}
      <div className="border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
        <p className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-widest">
          Financial Link {transaction ? "(Editing Record)" : "(Optional)"}
        </p>
      </div>

      {/* CORE FINANCIALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Total Cost (NPR)"
          name="cost"
          type="number"
          defaultValue={transaction?.amount}
          placeholder="Leave blank if donated"
        />

        {/* ACCOUNT SELECT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-black text-zinc-500 dark:text-zinc-400 tracking-widest">
            Expense Account
          </label>

          <select
            name="accountHead"
            defaultValue={transaction?.accountHead?._id?.toString()}
            className="
              w-full p-2.5 text-xs font-bold
              border border-zinc-200 dark:border-zinc-700
              rounded-xl
              bg-white dark:bg-zinc-900
              text-zinc-900 dark:text-zinc-100
              outline-none
              focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200
              transition-all
            "
          >
            <option value="" className="text-zinc-400">
              Select Account (Req. if cost &gt; 0)
            </option>

            {expenseAccounts.map((acc: any) => (
              <option key={acc._id.toString()} value={acc._id.toString()}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PAYMENT + DATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          label="Date of Purchase"
          name="date"
          type="date"
          defaultValue={
            transaction?.date
              ? new Date(transaction.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
        />
      </div>

      {/* EXTRA INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Vendor / Donor Name"
          name="donorOrVendorName"
          defaultValue={transaction?.donorOrVendorName}
          placeholder="e.g. Local Market"
        />

        <FormField
          label="Reference / Cheque No."
          name="referenceNumber"
          defaultValue={transaction?.referenceNumber}
          placeholder="Optional"
        />
      </div>
    </div>
  );
};