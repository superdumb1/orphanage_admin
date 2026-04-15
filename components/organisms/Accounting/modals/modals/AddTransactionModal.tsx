"use client";
import React, {
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
    // OVERLAY: Updated bg-zinc-900/60 -> bg-bg-invert/20 with blur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      {/* MODAL SHELL: Updated to bg-card, border-border, rounded-dashboard */}
      <div className="bg-card rounded-dashboard shadow-glow w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border transition-colors duration-500 animate-in zoom-in-95">

        <Header onClose={onClose} transactionType={transactionType} />

        <form action={formAction} className="flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

            {/* ERROR: Semantic danger colors */}
            {state?.error && (
              <p className="text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold transition-colors">
                ⚠️ {state.error}
              </p>
            )}

            {/* TYPE SWITCH: bg-zinc-100 -> bg-shaded */}
            <div className="flex bg-shaded p-1.5 rounded-xl border border-border transition-colors">
              <button
                type="button"
                onClick={() => setTransactionType("EXPENSE")}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                  transactionType === "EXPENSE"
                    ? "bg-card text-danger shadow-sm border border-border/50"
                    : "text-text-muted hover:text-text"
                }`}
              >
                EXPENSE
              </button>

              <button
                type="button"
                onClick={() => setTransactionType("INCOME")}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                  transactionType === "INCOME"
                    ? "bg-card text-success shadow-sm border border-border/50"
                    : "text-text-muted hover:text-text"
                }`}
              >
                INCOME
              </button>
            </div>

            <input type="hidden" name="type" value={transactionType} />

            {/* CORE DETAILS: bg-zinc-50 -> bg-shaded */}
            <div className="grid bg-shaded rounded-2xl p-6 grid-cols-1 md:grid-cols-2 gap-6 border border-border">
              <FormField
                label="Amount (NPR) *"
                name="amount"
                type="number"
                required
                placeholder="e.g. 5000"
                className="text-text"
              />

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                  Account Head *
                </label>

                <select
                  name="accountHead"
                  required
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
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
                  className="text-text"
                  options={availableSubTypes.map((t: string) => ({
                    label: t,
                    value: t
                  }))}
                />
              )}
            </div>

            {/* CONTEXT: bg-zinc-50 -> bg-shaded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-shaded p-6 rounded-2xl border border-border">
              <SelectField
                id="paymentMethod"
                name="paymentMethod"
                label="Payment Method"
                className="text-text"
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
                className="text-text color-scheme-adaptive"
              />
            </div>

            {/* EXTRA FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={`${transactionType === "INCOME" ? "Donor / Source" : "Vendor Name"}`}
                name="donorOrVendorName"
                placeholder="e.g. John Doe"
                className="text-text"
              />

              <FormField
                label="Reference No."
                name="referenceNumber"
                placeholder="Optional"
                className="text-text"
              />
            </div>

            <FormField
              label="Description *"
              name="description"
              required
              placeholder="What was this transaction for?"
              className="text-text"
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
      className={`p-6 md:px-8 md:py-7 border-b border-border flex justify-between items-center transition-colors duration-500 ${
        transactionType === "INCOME"
          ? "bg-success/10"
          : "bg-danger/10"
      }`}
    >
      <div>
        <h2 className="font-black text-xl text-text tracking-tight">
          Record Transaction
        </h2>
        <p className="text-xs text-text-muted font-medium mt-0.5">
          Log income or expense entry
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border hover:bg-card text-text-muted hover:text-text transition-all active:scale-95"
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
    <div className="flex justify-end gap-3.5 p-6 md:px-8 border-t border-border bg-card shrink-0 transition-colors duration-500">
      <Button 
        type="button" 
        variant="ghost" 
        onClick={onClose}
        className="text-text-muted hover:text-text hover:bg-shaded font-bold"
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={isPending || accountOptions.length === 0}
        className={`px-10 font-black text-text-invert shadow-glow active:scale-95 transition-all h-11 ${
          transactionType === "INCOME"
            ? "bg-success hover:bg-success/90"
            : "bg-danger hover:bg-danger/90"
        }`}
      >
        {isPending ? "Saving..." : "Record Transaction"}
      </Button>
    </div>
  );
};