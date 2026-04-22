"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addTransaction } from "@/app/actions/transactions";

interface AddTransactionModalProps {
  closeModal: () => void;
  initialData?: any;
}

export const TransactionForm: React.FC<AddTransactionModalProps> = ({
  closeModal,
  initialData
}) => {
  const { data: session } = useSession();

  const [state, formAction, isPending] = useActionState(
    addTransaction as any,
    { error: null, success: false }
  );

  const [accounts, setAccounts] = useState<any[]>([]);

  // 1. DYNAMIC VALIDATION STATE
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || "CASH");
  const isAccountHeadRequired = paymentMethod !== "OUT_OF_POCKET";

  // 2. INITIALIZE TRANSACTION TYPE
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    initialData?.type === "INCOME" || initialData?.type === "IN" ? "INCOME" : "EXPENSE"
  );

  // 3. ACCOUNT SELECTION STATE
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialData?.accountHead?._id || initialData?.accountHead || initialData?.item?._id || ""
  );

  // FETCH ACCOUNT HEADS
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/finances/accountHead');
        if (!response.ok) throw new Error("Failed to fetch accounts");
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching account heads:", error);
      }
    };
    fetchAccounts();
  }, []);

  // AUTO-CLOSE ON SUCCESS
  useEffect(() => {
    if (state?.success) closeModal();
  }, [state?.success, closeModal]);

  // COMPUTED VALUES
  const filteredAccounts = accounts?.filter((acc) => acc.type === transactionType) || [];
  const selectedAccount = accounts?.find((acc) => acc._id === selectedAccountId);
  const availableSubTypes = selectedAccount?.subType || [];

  // ✨ NEW: Get only the accounts that are flagged as Bank Accounts
  const availableBanks = accounts?.filter((acc) => acc.isBankAccount) || [];

  const defaultDate = initialData?.date
    ? new Date(initialData.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <form action={formAction} className="w-full flex flex-col gap-6">

      {/* HIDDEN FIELDS */}
      {initialData?._id && <input type="hidden" name="id" value={initialData._id} />}
      <input type="hidden" name="type" value={transactionType} />
      <input type="hidden" name="createdBy" value={session?.user?.id} />
      <input
        type="hidden"
        name="status"
        value={session?.user?.role === "ADMIN" ? "VERIFIED" : "PENDING"}
      />

      {/* ERROR BANNER */}
      {state?.error && (
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-black shrink-0">
          <span className="text-lg">⚠️</span>
          <span>System Alert: {state.error}</span>
        </div>
      )}

      {/* ROLE INFO BOX */}
      {session?.user?.role && session?.user?.role !== "ADMIN" && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-[10px] font-black text-warning uppercase tracking-widest">
            Protocol Note: This entry will be marked as "Pending" until verified by Administration.
          </p>
        </div>
      )}

      {/* TYPE SWITCH */}
      <div className="flex bg-shaded p-1 rounded-xl border border-border shrink-0">
        <button
          type="button"
          onClick={() => { setTransactionType("EXPENSE"); setSelectedAccountId(""); }}
          disabled={!!initialData}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-300 ${transactionType === "EXPENSE" ? "bg-card text-danger shadow-sm border border-border/50" : "text-text-muted"}`}
        >
          EXPENSE (OUT)
        </button>
        <button
          type="button"
          onClick={() => { setTransactionType("INCOME"); setSelectedAccountId(""); }}
          disabled={!!initialData}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-300 ${transactionType === "INCOME" ? "bg-card text-success shadow-sm border border-border/50" : "text-text-muted"}`}
        >
          INCOME (IN)
        </button>
      </div>

      {/* FINANCIAL DETAILS */}
      <div className="grid bg-shaded rounded-2xl p-6 grid-cols-1 md:grid-cols-2 gap-6 border border-border shrink-0">
        <FormField
          id="amount"
          label="Amount (NPR) *"
          name="amount"
          type="number"
          required
          placeholder="e.g. 5000"
          className="text-text font-mono"
          defaultValue={initialData?.amount || ""}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="accountHead" className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
            Account Head {isAccountHeadRequired ? "*" : "(Optional)"}
          </label>
          <select
            name="accountHead"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            required={isAccountHeadRequired}
            className={`w-full p-3.5 text-sm border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary outline-none transition-all font-medium ${!isAccountHeadRequired ? "border-dashed opacity-80" : "border-solid border-border"
              }`}
          >
            <option value="">Select Account...</option>
            {filteredAccounts.map((acc: any) => (
              <option key={acc._id} value={acc._id}>{acc.name} ({acc.code})</option>
            ))}
          </select>
        </div>
        {availableSubTypes.length > 0 && (
          <SelectField
            id="subType"
            name="subType"
            label="Head Sub-Type"
            // ✨ ADDED BACKWARD COMPATIBILITY: Looks for the new name first, then the old name
            defaultValue={initialData?.subType || initialData?.subTypeSelected || ""}
            options={availableSubTypes.map((t: string) => ({ label: t, value: t }))}
          />
        )}
      </div>

      {/* TRANSACTION CONTEXT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-shaded p-6 rounded-2xl border border-border shrink-0">

        <div className="flex flex-col gap-4 w-full">
          <SelectField
            id="paymentMethod"
            name="paymentMethod"
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { label: "Cash (Orphanage Funds)", value: "CASH" },
              { label: "Bank Transfer", value: "BANK" },
              { label: "Cheque", value: "CHEQUE" },
              { label: "Out of Pocket (My Personal Money)", value: "OUT_OF_POCKET" }
            ]}
          />

          {/* ✨ NEW: Conditionally show Bank Selector */}
          {(paymentMethod === "BANK" || paymentMethod === "CHEQUE") && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em] mb-2 block">
                Select Source/Destination Bank *
              </label>
              <select
                name="bankAccountId" // The server action needs to grab this
                required
                defaultValue={initialData?.bankAccountId || ""}
                className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              >
                <option value="">Select Bank Account...</option>
                {availableBanks.map((bank: any) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.name} ({bank.bankDetails?.accountNumber || bank.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <FormField
          id="date"
          label="Transaction Date"
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className="text-text color-scheme-adaptive font-mono"
        />
      </div>

      {/* ENTITY & REFERENCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <FormField
          id="donorOrVendorName"
          label={transactionType === "INCOME" ? "Donor / Source" : "Vendor Name"}
          name="donorOrVendorName"
          placeholder="e.g. John Doe"
          defaultValue={initialData?.donorOrVendorName || ""}
        />
        <FormField
          id="referenceNumber"
          label="Reference No."
          name="referenceNumber"
          placeholder="Cheque / Bill No."
          defaultValue={initialData?.referenceNumber || ""}
        />
      </div>

      <FormField
        id="description"
        label="Description *"
        name="description"
        required
        placeholder="What was this for?"
        defaultValue={initialData?.description || ""}
      />

      {/* ACTIONS */}
      <div className="shrink-0 flex justify-end gap-3.5 pt-6 border-t border-border mt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={closeModal}
          className="text-text-muted hover:text-text font-bold text-xs uppercase tracking-wider"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending || (isAccountHeadRequired && !selectedAccountId)}
          className={`px-8 font-black text-xs uppercase tracking-widest text-text-invert shadow-glow h-11 ${transactionType === "INCOME" ? "bg-success hover:bg-success/90" : "bg-danger hover:bg-danger/90"
            }`}
        >
          {isPending ? "PROCESSING..." : (initialData ? "Update Record" : "Save Transaction")}
        </Button>
      </div>
    </form>
  );
};