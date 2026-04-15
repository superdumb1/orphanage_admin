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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200 animate-in zoom-in-95">

                {/* HEADER */}
                <Header
                    onClose={onClose}
                    transactionType={transactionType}
                />

                <form action={formAction} className="flex flex-col overflow-hidden">

                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">

                        {state?.error && (
                            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 font-bold">
                                ⚠️ {state.error}
                            </p>
                        )}

                        {/* TYPE TOGGLE */}
                        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                            <button
                                type="button"
                                onClick={() => setTransactionType("EXPENSE")}
                                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all
                                ${
                                    transactionType === "EXPENSE"
                                        ? "bg-white text-rose-600 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-800"
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
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-800"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label={`${
                                    transactionType === "EXPENSE"
                                        ? ""
                                        : "Donor / "
                                }Vendor Name`}
                                name="donorOrVendorName"
                                placeholder="e.g. John Doe / Nepal Electricity"
                            />

                            <FormField
                                label="Reference / Cheque No."
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
            className={`p-6 md:p-8 border-b shrink-0 flex justify-between items-center
            ${
                transactionType === "INCOME"
                    ? "bg-emerald-50/40"
                    : "bg-rose-50/40"
            }`}
        >
            <div>
                <h2 className="font-black text-zinc-900 text-xl tracking-tighter">
                    Record Transaction
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                    Log a new income or expense to the ledger.
                </p>
            </div>

            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full
                text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
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
        <div className="grid bg-zinc-50 border border-zinc-100 rounded-2xl p-5 grid-cols-1 md:grid-cols-2 gap-6">

            <FormField
                label="Amount (NPR) *"
                name="amount"
                type="number"
                required
                placeholder="e.g. 5000"
            />

            <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                    Account Head *
                </label>

                <select
                    name="accountHead"
                    required
                    className="
                        w-full p-3 text-sm text-zinc-900
                        border border-zinc-200 rounded-xl
                        outline-none
                        focus:ring-2 focus:ring-zinc-900
                        focus:border-zinc-900
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-5 rounded-2xl border border-zinc-100">

            <SelectField
                label="Payment Method"
                name="paymentMethod"
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
        <div className="flex justify-end gap-3 p-6 border-t border-zinc-100 bg-white shrink-0 rounded-b-3xl">

            <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="px-6 font-bold text-zinc-500 hover:text-zinc-800"
            >
                Cancel
            </Button>

            <Button
                type="submit"
                disabled={isPending || accountOptions.length === 0}
                className={`font-black px-12 shadow-lg transition
                ${
                    transactionType === "INCOME"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                        : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100"
                }`}
            >
                {isPending ? "Saving..." : "Record Transaction"}
            </Button>
        </div>
    );
};