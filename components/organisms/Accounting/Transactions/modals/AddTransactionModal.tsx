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

    const selectedAccount = accounts.find(
        (acc) => acc._id === selectedAccountId
    );

    const availableSubTypes = selectedAccount?.subType || [];

    const filteredAccounts = accounts.filter(
        (acc) => acc.type === transactionType
    );

    const accountOptions = filteredAccounts.map((acc) => ({
        label: `${acc.name} (${acc.code})`,
        value: acc._id
    }));

    return (
        // OVERLAY: Updated bg-zinc-900/60 -> bg-bg-invert/20
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in duration-300">

            {/* SHELL: Updated bg-white -> bg-card, rounded-3xl -> rounded-dashboard, border-zinc-200 -> border-border */}
            <div className="bg-card rounded-dashboard shadow-glow w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border animate-in zoom-in-95 transition-colors duration-500">

                <Header
                    onClose={onClose}
                    transactionType={transactionType}
                />

                <form action={formAction} className="flex flex-col overflow-hidden">

                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                        {/* ERROR: Updated bg-rose-50 -> bg-danger/10, text-rose-600 -> text-danger */}
                        {state?.error && (
                            <p className="text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold transition-colors">
                                ⚠️ {state.error}
                            </p>
                        )}

                        {/* TYPE TOGGLE: Updated bg-zinc-100 -> bg-shaded, border-zinc-200 -> border-border */}
                        <div className="flex bg-shaded p-1.5 rounded-xl border border-border transition-colors">
                            <button
                                type="button"
                                onClick={() => setTransactionType("EXPENSE")}
                                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all
                                ${
                                    transactionType === "EXPENSE"
                                        ? "bg-card text-danger shadow-sm border border-border/50"
                                        : "text-text-muted hover:text-text"
                                }`}
                            >
                                EXPENSE (Out)
                            </button>

                            <button
                                type="button"
                                onClick={() => setTransactionType("INCOME")}
                                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all
                                ${
                                    transactionType === "INCOME"
                                        ? "bg-card text-success shadow-sm border border-border/50"
                                        : "text-text-muted hover:text-text"
                                }`}
                            >
                                INCOME (In)
                            </button>
                        </div>

                        <input type="hidden" name="type" value={transactionType} />

                        {/* CORE */}
                        <CoreDetails
                            selectedAccountId={selectedAccountId}
                            setSelectedAccountId={setSelectedAccountId}
                            filteredAccounts={filteredAccounts}
                            availableSubTypes={availableSubTypes}
                        />

                        {/* CONTEXT */}
                        <ContextRow />

                        {/* EXTRA FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label={`${
                                    transactionType === "EXPENSE"
                                        ? ""
                                        : "Donor / "
                                }Vendor Name`}
                                name="donorOrVendorName"
                                placeholder="e.g. John Doe / Nepal Electricity"
                                className="text-text"
                            />

                            <FormField
                                label="Reference / Cheque No."
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
                        accountOptions={accountOptions}
                        onClose={onClose}
                        transactionType={transactionType}
                    />
                </form>
            </div>
        </div>
    );
};

/* ---------------- HEADER ---------------- */

const Header = ({
    onClose,
    transactionType
}: {
    onClose: () => void;
    transactionType: "INCOME" | "EXPENSE";
}) => {
    return (
        <div
            // HEADER BG: Dynamically uses danger/success with opacity instead of static rose/emerald
            className={`p-6 md:px-8 md:py-6 border-b border-border shrink-0 flex justify-between items-center transition-colors
            ${
                transactionType === "INCOME"
                    ? "bg-success/10"
                    : "bg-danger/10"
            }`}
        >
            <div>
                {/* Typography: text-zinc-900 -> text-text, text-zinc-500 -> text-text-muted */}
                <h2 className="font-black text-text text-xl tracking-tight">
                    Record Transaction
                </h2>
                <p className="text-xs text-text-muted font-medium mt-0.5">
                    Log a new income or expense to the ledger.
                </p>
            </div>

            {/* Close Button: Styled to match your standard modal close buttons */}
            <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border hover:bg-card text-text-muted hover:text-text transition-all active:scale-95"
            >
                ✕
            </button>
        </div>
    );
};

/* ---------------- CORE ---------------- */

const CoreDetails = ({
    selectedAccountId,
    setSelectedAccountId,
    filteredAccounts,
    availableSubTypes
}: {
    selectedAccountId: string;
    setSelectedAccountId: Dispatch<SetStateAction<string>>;
    filteredAccounts: any;
    availableSubTypes: any;
}) => {
    return (
        // BOX: bg-zinc-50 -> bg-shaded, border-zinc-100 -> border-border
        <div className="grid bg-shaded border border-border rounded-2xl p-6 grid-cols-1 md:grid-cols-2 gap-6 transition-colors">

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

                {/* SELECT: Replaced hardcoded zinc styles with bg-bg, text-text, focus:ring-primary */}
                <select
                    name="accountHead"
                    required
                    className="
                        w-full p-3.5 text-sm text-text bg-bg
                        border border-border rounded-xl
                        outline-none cursor-pointer
                        focus:ring-2 focus:ring-primary
                        focus:border-primary
                        transition-all
                    "
                    onChange={(e) =>
                        setSelectedAccountId(e.target.value)
                    }
                    value={selectedAccountId}
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
                    label="Head Sub-Type"
                    name="subType"
                    className="text-text"
                    options={availableSubTypes.map((t: string) => ({
                        label: t,
                        value: t
                    }))}
                />
            )}
        </div>
    );
};

/* ---------------- CONTEXT ---------------- */

const ContextRow = () => {
    return (
        // BOX: bg-zinc-50 -> bg-shaded, border-zinc-100 -> border-border
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-shaded p-6 rounded-2xl border border-border transition-colors">

            <SelectField
                label="Payment Method"
                name="paymentMethod"
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
    );
};

/* ---------------- FOOTER ---------------- */

const Footer = ({
    isPending,
    accountOptions,
    onClose,
    transactionType
}: any) => {
    return (
        // FOOTER BG: bg-white -> bg-card, border-zinc-100 -> border-border
        <div className="flex justify-end gap-3 p-6 md:px-8 border-t border-border bg-card shrink-0 transition-colors">

            <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="px-6 text-text-muted hover:text-text hover:bg-shaded transition-colors"
            >
                Cancel
            </Button>

            <Button
                type="submit"
                disabled={isPending || accountOptions.length === 0}
                // BUTTON BG: Use success/danger classes respectively, rather than strict emarald/rose
                className={`font-black px-10 transition-all active:scale-95 disabled:opacity-50 text-text-invert
                ${
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