"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { adjustStock } from "@/app/actions/inventory";
import { StockFinanceFields } from "./StockFinanceFields";
import { StockFormFields } from "./StockFormFields";

import { TInventoryItem, TAccountHead } from "@/types/Transaction";

interface ManageStockProps {
    isOpen: boolean;
    onClose: () => void;
    item: TInventoryItem | any;
    accounts?: TAccountHead[];
}

export const ManageStockModal: React.FC<ManageStockProps> = ({
    isOpen,
    onClose,
    item,
    accounts = [],
}) => {
    const [state, formAction, isPending] = useActionState(adjustStock as any, {
        error: null,
        success: false,
    });

    const [actionType, setActionType] = useState<"IN" | "OUT">("IN");

    const isFromFinance = !!item?.logId;
    const inventoryItem = isFromFinance ? item.logId.item : item;
    const logId = isFromFinance ? item.logId : null;
    const linkedTransaction = isFromFinance ? item : null;

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200 dark:border-zinc-800">

                <Header
                    title={inventoryItem.name}
                    currentStock={inventoryItem.currentStock}
                    unit={inventoryItem.unit}
                    type={actionType}
                    onClose={onClose}
                />

                <form action={formAction} className="flex flex-col overflow-hidden">
                    <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                        {state?.error && <ErrorBox error={state.error} />}

                        <input type="hidden" name="itemId" value={inventoryItem._id} />
                        <input type="hidden" name="type" value={actionType} />
                        {logId && <input type="hidden" name="logId" value={logId._id} />}

                        <TypeToggle
                            current={actionType}
                            set={setActionType}
                            disabled={!!linkedTransaction}
                        />

                        <StockFormFields
                            unit={inventoryItem.unit}
                            actionType={actionType}
                            defaultValue={logId}
                        />

                        {actionType === "IN" && (
                            <StockFinanceFields
                                accounts={accounts}
                                transaction={linkedTransaction}
                            />
                        )}
                    </div>

                    <Footer
                        isPending={isPending}
                        type={actionType}
                        onClose={onClose}
                    />
                </form>
            </div>
        </div>
    );
};
const Header = ({ title, currentStock, unit, type, onClose }: any) => (
    <div
        className={`p-6 border-b shrink-0 flex justify-between items-center
        bg-white dark:bg-zinc-900
        border-zinc-200 dark:border-zinc-800`}
    >
        <div>
            <h2 className="font-black text-zinc-900 dark:text-zinc-100 text-xl tracking-tighter">
                Update {title}
            </h2>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Stock:{" "}
                <strong className="text-zinc-700 dark:text-zinc-200">
                    {currentStock} {unit}
                </strong>
            </p>
        </div>

        <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
            ✕
        </button>
    </div>
);
const TypeToggle = ({ current, set, disabled }: any) => (
    <div
        className={`flex p-1 rounded-xl shrink-0
        bg-zinc-100 dark:bg-zinc-800
        ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
        {["OUT", "IN"].map((t) => (
            <button
                key={t}
                type="button"
                onClick={() => set(t)}
                className={`flex-1 py-3 text-xs font-black rounded-lg transition-all
                ${current === t
                        ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
            >
                STOCK {t} {t === "OUT" ? "(Consumed)" : "(Added)"}
            </button>
        ))}
    </div>
);
const Footer = ({ isPending, type, onClose }: any) => (
    <div className="flex justify-end gap-3 p-6 border-t bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="font-bold text-zinc-500 dark:text-zinc-400"
        >
            Cancel
        </Button>

        <Button
            type="submit"
            disabled={isPending}
            className={`font-black px-10 text-white ${type === "IN"
                    ? "bg-blue-600"
                    : "bg-orange-600"
                }`}
        >
            {isPending ? "Saving..." : `Confirm ${type}`}
        </Button>
    </div>
);

const ErrorBox = ({ error }: { error: string }) => <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">⚠️ {error}</p>;