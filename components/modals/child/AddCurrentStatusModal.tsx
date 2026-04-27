"use client";

import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { saveChildStatus, } from "@/app/actions/childStatus";
import { Activity, ShieldAlert } from "lucide-react";

interface ChildStatusFormProps {
    closeModal: () => void;
    onSaved?: (newData: { label: string; value: string }) => void;
}

const AddChildStatusModal: React.FC<ChildStatusFormProps> = ({
    closeModal,
    onSaved
}) => {
    // ✨ Initial state matching the ActionState interface exactly
    const initialState = {
        success: false,
        data: null,
        error: null
    };

    const [state, formAction, isPending] = useActionState(
        saveChildStatus,
        initialState
    );

    useEffect(() => {
        if (state?.success && state.data) {
            if (onSaved) onSaved(state.data);
            closeModal();
        }
    }, [state, closeModal, onSaved]);

    return (
        <form action={formAction} className="flex flex-col gap-8 w-full animate-in fade-in duration-500">

            {/* KREE CORP HEADER */}
            <div className="flex items-center gap-4 bg-primary/5 p-5 rounded-2xl border border-primary/20 shrink-0">
                <div className="w-10 h-10 bg-primary text-text-invert rounded-xl flex items-center justify-center shadow-glow-primary">
                    <Activity size={20} />
                </div>
                <div>
                    <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Registry Protocol</h2>
                    <p className="text-sm font-black text-text">New Personnel Status</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <FormField
                    label="Status Label *"
                    name="name"
                    required
                    placeholder="e.g. Hospitalized, Graduated, Reunited"
                />
                <p className="text-[9px] text-text-muted font-bold uppercase px-1">
                    This will appear as a selectable option in the Admission form.
                </p>
            </div>

            {/* ERROR FEEDBACK */}
            {state?.error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger text-[10px] font-black uppercase tracking-widest animate-shake">
                    <ShieldAlert size={14} /> {state.error}
                </div>
            )}

            {/* FOOTER */}
            <div className="flex justify-end items-center gap-6 pt-4 border-t border-border/50">
                <button
                    type="button"
                    onClick={closeModal}
                    className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-text transition-colors"
                >
                    Discard
                </button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary text-text-invert px-12 h-12 rounded-xl font-black shadow-glow active:scale-95 transition-all"
                >
                    {isPending ? "REGISTERING..." : "SAVE_STATUS"}
                </Button>
            </div>
        </form>
    );
};

export default AddChildStatusModal;