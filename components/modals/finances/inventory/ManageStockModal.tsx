"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { adjustStock } from "@/app/actions/inventory";
import { StockFinanceFields } from "../../../organisms/Accounting/modals/ManageStockModal/StockFinanceFields";
import { StockFormFields } from "../../../organisms/Accounting/modals/ManageStockModal/StockFormFields";

import { TInventoryItem, TAccountHead } from "@/types/Transaction";

interface ManageStockProps {
    closeModal: () => void;
    item: TInventoryItem | any;
}

export const ManageStockModal: React.FC<ManageStockProps> = ({
    closeModal,
    item,
}) => {
    const [state, formAction, isPending] = useActionState(adjustStock as any, {
        error: null,
        success: false,
    });
    const [accounts, setAccounts] = useState<any[]>([]);

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

    const [actionType, setActionType] = useState<"IN" | "OUT">("IN");

    const isFromFinance = !!item?.logId;
    const inventoryItem = isFromFinance ? item.logId.item : item;
    const logId = isFromFinance ? item.logId : null;
    const linkedTransaction = isFromFinance ? item : null;

    useEffect(() => {
        if (state?.success) closeModal();
    }, [state?.success, closeModal]);


    return (
        <form action={formAction} className="flex flex-col ">
            <div className=" flex flex-col gap-6 overflow-y-auto custom-scrollbar">
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
                closeModal={closeModal}
            />
        </form>

    );
};




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

const Footer = ({ isPending, type, closeModal }: any) => (
    <div className="flex justify-end gap-3 p-6 md:px-8 border-t border-border bg-card shrink-0 transition-colors">
        <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            className="font-bold text-text-muted hover:text-text hover:bg-shaded transition-colors"
        >
            Cancel
        </Button>

        <Button
            type="submit"
            disabled={isPending}
            // Colors: IN -> success, OUT -> warning
            className={`font-black px-10 h-11 shadow-glow active:scale-95 transition-all text-text-invert ${type === "IN"
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