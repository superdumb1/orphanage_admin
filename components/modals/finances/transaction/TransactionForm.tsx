"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // ✨ Added NextAuth Session
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
  // ✨ Get the current logged-in user
  const { data: session } = useSession(); 

  const [state, formAction, isPending] = useActionState(
    addTransaction as any,
    { error: null, success: false }
  );

  const [accounts, setAccounts] = useState<any[]>([]);

  // 1. INITIALIZE STATE
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    initialData?.type === "INCOME" || initialData?.type === "IN" ? "INCOME" : "EXPENSE"
  );

  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialData?.accountHead?._id || initialData?.accountHead || initialData?.item?._id || ""
  );

  // 2. FETCH ACCOUNT HEADS
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

  // 3. AUTO-CLOSE ON SUCCESS
  useEffect(() => {
    if (state?.success) closeModal();
  }, [state?.success, closeModal]);

  // 4. COMPUTED VALUES
  const filteredAccounts = accounts?.filter((acc) => acc.type === transactionType) || [];
  const selectedAccount = accounts?.find((acc) => acc._id === selectedAccountId);
  const availableSubTypes = selectedAccount?.subType || [];

  const defaultDate = initialData?.date
    ? new Date(initialData.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <form action={formAction} className="w-full flex flex-col gap-6">
      
      {/* ========================================================
          HIDDEN SYSTEM PROTOCOL FIELDS
          ======================================================== */}
      {initialData?._id && <input type="hidden" name="id" value={initialData._id} />}
      <input type="hidden" name="type" value={transactionType} />
      
      {/* Tracks who made this entry */}
      <input type="hidden" name="createdBy" value={session?.user?.id} />
      
      {/* If Admin -> instantly Verified. If Samity/Staff -> Pending Verification */}
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

      {/* SAMITY INFO BOX (Only shows for non-admins) */}
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
          onClick={() => {
            setTransactionType("EXPENSE");
            setSelectedAccountId("");
          }}
          disabled={!!initialData}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-300 ${
            transactionType === "EXPENSE"
              ? "bg-card text-danger shadow-sm border border-border/50"
              : "text-text-muted hover:text-text"
          }`}
        >
          EXPENSE (OUT)
        </button>

        <button
          type="button"
          onClick={() => {
            setTransactionType("INCOME");
            setSelectedAccountId("");
          }}
          disabled={!!initialData}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-300 ${
            transactionType === "INCOME"
              ? "bg-card text-success shadow-sm border border-border/50"
              : "text-text-muted hover:text-text"
          }`}
        >
          INCOME (IN)
        </button>
      </div>

      {/* CORE FINANCIAL DETAILS */}
      <div className="grid bg-shaded rounded-2xl p-6 grid-cols-1 md:grid-cols-2 gap-6 border border-border shrink-0">
        <FormField
          id="amount"
          label="Amount (NPR) *"
          name="amount"
          type="number"
          required
          placeholder="e.g. 5000"
          className="text-text font-mono"
          defaultValue={initialData?.amount || initialData?.quantity || ""}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="accountHead" className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
            Account Head *
          </label>
          <select
            id="accountHead"
            name="accountHead"
            required
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer font-medium"
          >
            <option value="">Select Account...</option>
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
            defaultValue={initialData?.subType || ""}
            options={availableSubTypes.map((t: string) => ({
              label: t,
              value: t
            }))}
          />
        )}
      </div>

      {/* TRANSACTION CONTEXT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-shaded p-6 rounded-2xl border border-border shrink-0">
    <SelectField
          id="paymentMethod"
          name="paymentMethod"
          label="Payment Method"
          className="text-text"
          defaultValue={initialData?.paymentMethod || "CASH"}
          options={[
            { label: "Cash (Orphanage Funds)", value: "CASH" },
            { label: "Bank Transfer", value: "BANK" },
            { label: "Cheque", value: "CHEQUE" },
            { label: "Out of Pocket (My Personal Money)", value: "OUT_OF_POCKET" }
          ]}
        />

        <FormField
          id="date"
          label="Transaction Date"
          name="date"
          type="date"
          required
          className="text-text color-scheme-adaptive font-mono"
          defaultValue={defaultDate}
        />
      </div>

      {/* ENTITY & REFERENCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <FormField
          id="donorOrVendorName"
          label={`${transactionType === "INCOME" ? "Donor / Source" : "Vendor Name"}`}
          name="donorOrVendorName"
          placeholder={`e.g. ${transactionType === "INCOME" ? "John Doe" : "Nepal Electricity Authority"}`}
          className="text-text"
          defaultValue={initialData?.donorOrVendorName || ""}
        />

        <FormField
          id="referenceNumber"
          label="Reference No."
          name="referenceNumber"
          placeholder="Cheque / Bill No."
          className="text-text"
          defaultValue={initialData?.referenceNumber || ""}
        />
      </div>

      <FormField
        id="description"
        label="Description *"
        name="description"
        required
        placeholder="What was this transaction for?"
        className="text-text shrink-0"
        defaultValue={initialData?.description || initialData?.reason || ""}
      />

      {/* FOOTER ACTIONS */}
      <div className="shrink-0 flex justify-end gap-3.5 pt-6 border-t border-border mt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={closeModal}
          className="text-text-muted hover:text-text hover:bg-shaded font-bold text-xs uppercase tracking-wider"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending || filteredAccounts.length === 0 || !selectedAccountId}
          className={`px-8 font-black text-xs uppercase tracking-widest text-text-invert shadow-glow active:scale-95 transition-all h-11 ${
            transactionType === "INCOME" ? "bg-success hover:bg-success/90" : "bg-danger hover:bg-danger/90"
          }`}
        >
          {isPending ? "PROCESSING..." : (initialData ? "Update" : "Save Record")}
        </Button>
      </div>
    </form>
  );
};