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
        // Overlay: Updated to use bg-bg-invert/20 and backdrop-blur-md
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in">
            
            {/* Modal Shell: bg-white -> bg-card, border-zinc -> border-border, rounded-3xl -> rounded-dashboard */}
            <div className="bg-card rounded-dashboard shadow-glow w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden border border-border transition-colors duration-500 animate-in zoom-in-95">

                <Header
                    title={inventoryItem.name}
                    currentStock={inventoryItem.currentStock}
                    unit={inventoryItem.unit}
                    type={actionType}
                    onClose={onClose}
                />

                <form action={formAction} className="flex flex-col overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
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

                        {/* Financial Bridge - Already themed using success/warning logic */}
                        {actionType === "IN" && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <StockFinanceFields
                                    accounts={accounts}
                                    transaction={linkedTransaction}
                                />
                            </div>
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

/* ---------------- HEADER ---------------- */

const Header = ({ title, currentStock, unit, onClose }: any) => (
    <div className="p-6 md:px-8 border-b border-border shrink-0 flex justify-between items-center bg-card transition-colors">
        <div>
            {/* Typography: text-zinc-900 -> text-text */}
            <h2 className="font-black text-text text-xl tracking-tighter">
                Update {title}
            </h2>

            {/* Micro-caps for metadata */}
            <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mt-1">
                Current Stock:{" "}
                <span className="text-primary">
                    {currentStock} {unit}
                </span>
            </p>
        </div>

        <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border hover:bg-shaded text-text-muted hover:text-text transition-all active:scale-95"
        >
            ✕
        </button>
    </div>
);

/* ---------------- TYPE TOGGLE ---------------- */

const TypeToggle = ({ current, set, disabled }: any) => (
    <div
        className={`flex bg-shaded p-1.5 rounded-xl border border-border transition-all
        ${disabled ? "opacity-40 grayscale pointer-events-none" : ""}`}
    >
        {["OUT", "IN"].map((t) => (
            <button
                key={t}
                type="button"
                onClick={() => set(t)}
                className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all
                ${current === t
                        ? "bg-card shadow-sm border border-border/50 text-text"
                        : "text-text-muted hover:text-text"
                    }`}
            >
                STOCK {t} {t === "OUT" ? "(Consumed)" : "(Added)"}
            </button>
        ))}
    </div>
);

/* ---------------- FOOTER ---------------- */

const Footer = ({ isPending, type, onClose }: any) => (
    <div className="flex justify-end gap-3 p-6 md:px-8 border-t border-border bg-card shrink-0 transition-colors">
        <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="font-bold text-text-muted hover:text-text hover:bg-shaded transition-colors"
        >
            Cancel
        </Button>

        <Button
            type="submit"
            disabled={isPending}
            // Colors: IN -> success, OUT -> warning
            className={`font-black px-10 h-11 shadow-glow active:scale-95 transition-all text-text-invert ${
                type === "IN"
                    ? "bg-success hover:bg-success/90"
                    : "bg-warning hover:bg-warning/90"
            }`}
        >
            {isPending ? "Saving..." : `Confirm Stock ${type}`}
        </Button>
    </div>
);

/* ---------------- ERROR BOX ---------------- */

const ErrorBox = ({ error }: { error: string }) => (
    <p className="text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold animate-in shake-in transition-colors">
        ⚠️ {error}
    </p>
);