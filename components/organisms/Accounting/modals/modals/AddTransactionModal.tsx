"use client";
import React, {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState
} from "react";

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

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  accounts,
  transaction
}) => {
  const [state, formAction, isPending] = useActionState(
    addTransaction as any,
    { error: null, success: false }
  );

  const [transactionType, setTransactionType] =
    useState<"INCOME" | "EXPENSE">("EXPENSE");

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  useEffect(() => {
    if (state?.success) onClose();
  }, [state?.success, onClose]);

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter(
    (acc) => acc.type === transactionType
  );

  const selectedAccount = accounts.find(
    (acc) => acc._id === selectedAccountId
  );

  const availableSubTypes = selectedAccount?.subType || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200">

        <Header onClose={onClose} transactionType={transactionType} />

        <form action={formAction} className="flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">

            {state?.error && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">
                ⚠️ {state.error}
              </p>
            )}

            {/* TYPE SWITCH */}
            <div className="flex bg-zinc-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTransactionType("EXPENSE")}
                className={`flex-1 py-2 text-xs font-black rounded-lg ${
                  transactionType === "EXPENSE"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                EXPENSE
              </button>

              <button
                type="button"
                onClick={() => setTransactionType("INCOME")}
                className={`flex-1 py-2 text-xs font-black rounded-lg ${
                  transactionType === "INCOME"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                INCOME
              </button>
            </div>

            <input type="hidden" name="type" value={transactionType} />

            {/* CORE */}
            <div className="grid bg-zinc-50 rounded-xl p-5 grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Amount (NPR) *"
                name="amount"
                type="number"
                required
                placeholder="e.g. 5000"
              />

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                  Account Head *
                </label>

                <select
                  name="accountHead"
                  required
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full p-3 text-sm border border-zinc-200 rounded-xl text-black focus:ring-2 focus:ring-zinc-900 outline-none"
                >
                  <option value="">Select...</option>
                  {filteredAccounts.map((acc: any) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.code})
                    </option>
                  ))}
                </select>
              </div>

              {availableSubTypes.length > 0 && (
                <SelectField
                  id="subType"
                  name="subType"
                  label="Head Sub-Type"
                  options={availableSubTypes.map((t: string) => ({
                    label: t,
                    value: t
                  }))}
                />
              )}
            </div>

            {/* CONTEXT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-5 rounded-xl border border-zinc-100">
              <SelectField
                id="paymentMethod"
                name="paymentMethod"
                label="Payment Method"
                options={[
                  { label: "Cash", value: "CASH" },
                  { label: "Bank Transfer", value: "BANK" },
                  { label: "Cheque", value: "CHEQUE" }
                ]}
              />

              <FormField
                label="Date"
                name="date"
                type="date"
                required
              />
            </div>

            {/* EXTRA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={`${transactionType === "INCOME" ? "Donor / Vendor" : "Vendor Name"}`}
                name="donorOrVendorName"
                placeholder="e.g. John Doe"
              />

              <FormField
                label="Reference No."
                name="referenceNumber"
                placeholder="Optional"
              />
            </div>

            <FormField
              label="Description *"
              name="description"
              required
              placeholder="What was this transaction for?"
            />
          </div>

          <Footer
            isPending={isPending}
            transactionType={transactionType}
            onClose={onClose}
            accountOptions={filteredAccounts}
          />
        </form>
      </div>
    </div>
  );
};

/* ---------------- HEADER ---------------- */
const Header: React.FC<{
  onClose: () => void;
  transactionType: "INCOME" | "EXPENSE";
}> = ({ onClose, transactionType }) => {
  return (
    <div
      className={`p-6 border-b flex justify-between items-center ${
        transactionType === "INCOME"
          ? "bg-emerald-50/50"
          : "bg-rose-50/50"
      }`}
    >
      <div>
        <h2 className="font-black text-xl text-zinc-900">
          Record Transaction
        </h2>
        <p className="text-xs text-zinc-500">
          Log income or expense entry
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
  );
};

/* ---------------- FOOTER ---------------- */
const Footer: React.FC<{
  isPending: boolean;
  transactionType: "INCOME" | "EXPENSE";
  onClose: () => void;
  accountOptions: any[];
}> = ({ isPending, transactionType, onClose, accountOptions }) => {
  return (
    <div className="flex justify-end gap-3 p-6 border-t bg-white">
      <Button type="button" variant="ghost" onClick={onClose}>
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={isPending || accountOptions.length === 0}
        className={`px-10 font-black text-white ${
          transactionType === "INCOME"
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-rose-600 hover:bg-rose-700"
        }`}
      >
        {isPending ? "Saving..." : "Record Transaction"}
      </Button>
    </div>
  );
};