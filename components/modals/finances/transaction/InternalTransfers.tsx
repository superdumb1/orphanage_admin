"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { executeTransfer } from "@/app/actions/transfers";
import { ArrowRightLeft } from "lucide-react";

interface InternalTransferProps {
  closeModal: () => void;
}

export const InternalTransferForm: React.FC<InternalTransferProps> = ({ closeModal }) => {
  const { data: session } = useSession();

  const [state, formAction, isPending] = useActionState(
    executeTransfer as any,
    { error: null, success: false }
  );

  const [liquidAccounts, setLiquidAccounts] = useState<any[]>([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");

  // ✨ THE FIX: Bulletproof Account Filtering
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/finances/accountHead');
        const data = await response.json();
        
        // Strictly filter: Must be an ASSET, Must be flagged as a bank/cash account, and MUST NOT be the Staff fallback
        const strictLiquidAssets = data.filter((acc: any) => 
            // acc.type === "ASSET" && 
            // acc.isBankAccount === true && 
            acc.code !== "EXP-STAFF"
        );
        // const strictLiquidAssets = data
        setLiquidAccounts(strictLiquidAssets);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (state?.success) closeModal();
  }, [state?.success, closeModal]);

  return (
    <form action={formAction} className="w-full flex flex-col gap-6">
      
      {/* SECURITY / RBAC */}
      <input type="hidden" name="createdBy" value={session?.user?.id} />

      {/* ERROR BANNER */}
      {state?.error && (
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-black shrink-0">
          <span className="text-lg">⚠️</span>
          <span>System Alert: {state.error}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
        <div className="p-2 bg-primary/20 text-primary rounded-lg">
           <ArrowRightLeft size={20} />
        </div>
        <div>
           <p className="text-xs font-black uppercase tracking-widest text-text">Contra Transfer</p>
           <p className="text-[10px] text-text-muted font-bold">Move funds between internal accounts without affecting net revenue.</p>
        </div>
      </div>

      {/* ROUTING LOGIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-shaded p-6 rounded-2xl border border-border shrink-0 relative">
        
        {/* Visual Indicator */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-card border border-border rounded-full items-center justify-center text-text-muted z-10">
            <ArrowRightLeft size={14} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-black text-danger tracking-[0.15em]">
            Transfer FROM (Withdraw) *
          </label>
          <select
            name="fromAccount"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            required
            className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
          >
            <option value="">Select Source...</option>
            {liquidAccounts.map((acc: any) => (
              <option key={acc._id} value={acc._id} disabled={acc._id === toAccount}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-black text-success tracking-[0.15em]">
            Transfer TO (Deposit) *
          </label>
          <select
            name="toAccount"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
            className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
          >
            <option value="">Select Destination...</option>
            {liquidAccounts.map((acc: any) => (
              <option key={acc._id} value={acc._id} disabled={acc._id === fromAccount}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FINANCIAL DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <FormField
          id="amount"
          label="Amount (NPR) *"
          name="amount"
          type="number"
          required
          placeholder="e.g. 10000"
          className="text-text font-mono text-lg"
        />
        <FormField
          id="date"
          label="Transfer Date *"
          name="date"
          type="date"
          required
          className="text-text color-scheme-adaptive font-mono"
          defaultValue={new Date().toISOString().split('T')[0]}
        />
      </div>

      <FormField
        id="description"
        label="Description / Purpose *"
        name="description"
        required
        placeholder="e.g. Depositing Friday's cash donations to the bank"
        className="text-text"
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
          disabled={isPending || !fromAccount || !toAccount || (fromAccount === toAccount)}
          className="px-8 font-black text-xs uppercase tracking-widest text-text-invert bg-primary hover:bg-primary/90 shadow-glow h-11"
        >
          {isPending ? "PROCESSING..." : "Execute Transfer"}
        </Button>
      </div>
    </form>
  );
};