"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { adjustStock } from "@/app/actions/inventory";
import { StockFinanceFields } from "./StockFinanceFields";
import { StockFormFields } from "./StockFormFields";

interface ManageStockProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    accounts?: any[];
}

export const ManageStockModal: React.FC<ManageStockProps> = ({ isOpen, onClose, item, accounts = [] }) => {
    const [state, formAction, isPending] = useActionState(adjustStock as any, { error: null, success: false });

    const [actionType, setActionType] = useState<'IN' | 'OUT'>('IN');


    

    useEffect(() => { if (state?.success) onClose(); }, [state?.success, onClose]);

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200 animate-in zoom-in-95">

                <Header title={item.name} currentStock={item.currentStock} unit={item.unit} type={actionType} onClose={onClose} />

                <form action={formAction} className="flex flex-col overflow-hidden">
                    <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                        {state?.error && <ErrorBox error={state.error} />}

                        <input type="hidden" name="itemId" value={item._id} />
                        <input type="hidden" name="type" value={actionType} />
                        {item?.logId && <input type="hidden" name="logId" value={item.logId} />}

                        <TypeToggle current={actionType} set={setActionType} disabled={!!item} />

                        <StockFormFields
                            unit={item.unit}
                            actionType={actionType}
                            defaultValue={item.logId}
                        />

                        {actionType === 'IN' && (
                            <StockFinanceFields accounts={accounts} transaction={item} />
                        )}
                    </div>

                    <Footer isPending={isPending} type={actionType} onClose={onClose} />
                </form>
            </div>
        </div>
    );
};

const ErrorBox = ({ error }: { error: string }) => <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">⚠️ {error}</p>;

const TypeToggle = ({ current, set, disabled }: any) => (
    <div className={`flex bg-zinc-100 p-1 rounded-xl shrink-0 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {['OUT', 'IN'].map((t) => (
            <button key={t} type="button" onClick={() => set(t)} className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${current === t ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}>
                STOCK {t} {t === 'OUT' ? '(Consumed)' : '(Added)'}
            </button>
        ))}
    </div>
);

const Header = ({ title, currentStock, unit, type, onClose }: any) => (
    <div className={`p-6 border-b shrink-0 flex justify-between items-center ${type === 'IN' ? 'bg-blue-50/50' : 'bg-orange-50/50'}`}>
        <div>
            <h2 className="font-black text-zinc-900 text-xl tracking-tighter">Update {title}</h2>
            <p className="text-xs text-zinc-500 font-medium">Stock: <strong>{currentStock} {unit}</strong></p>
        </div>
        <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">✕</button>
    </div>
);

const Footer = ({ isPending, type, onClose }: any) => (
    <div className="flex justify-end gap-3 p-6 border-t bg-white shrink-0">
        <Button type="button" variant="ghost" onClick={onClose} className="font-bold text-zinc-500">Cancel</Button>
        <Button type="submit" disabled={isPending} className={`font-black px-10 text-white ${type === 'IN' ? 'bg-blue-600 shadow-blue-200' : 'bg-orange-600 shadow-orange-200'}`}>
            {isPending ? "Saving..." : `Confirm ${type}`}
        </Button>
    </div>
);