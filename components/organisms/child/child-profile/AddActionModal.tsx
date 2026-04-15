"use client";
import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { createActionItem } from "@/app/actions/actionPlans";

export const AddActionItemModal = ({
    isOpen,
    onClose,
    childId
}: {
    isOpen: boolean;
    onClose: () => void;
    childId: string;
}) => {
    const [state, formAction, isPending] = useActionState(
        createActionItem as any,
        { error: null, success: false }
    );

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/70 backdrop-blur-sm p-4 animate-in fade-in">
            
            <div className="
                w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border
                bg-white dark:bg-zinc-950
                border-zinc-200 dark:border-zinc-800
                text-zinc-900 dark:text-zinc-100
                animate-in zoom-in-95
            ">
                
                {/* Header */}
                <div className="
                    p-6 border-b
                    bg-zinc-50 dark:bg-zinc-900/60
                    border-zinc-100 dark:border-zinc-800
                ">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-lg border border-orange-200 dark:border-orange-900">
                            🎯
                        </div>

                        <div>
                            <h2 className="font-bold text-lg tracking-tight">
                                New Action Item
                            </h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                Log a specific need or task for this child.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FORM */}
                <form action={formAction} className="p-6 flex flex-col gap-4">
                    
                    <input type="hidden" name="childId" value={childId} />

                    {state?.error && (
                        <p className="
                            text-xs font-bold p-2 rounded border
                            bg-red-50 dark:bg-red-950/40
                            text-red-600 dark:text-red-300
                            border-red-200 dark:border-red-900
                        ">
                            ⚠️ {state.error}
                        </p>
                    )}

                    <FormField
                        label="Task Title / Need *"
                        name="title"
                        required
                        placeholder="e.g., Dental Checkup, New School Bag"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Category"
                            name="category"
                            required
                            options={[
                                { label: "Medical (स्वास्थ्य)", value: "MEDICAL" },
                                { label: "Education (शिक्षा)", value: "EDUCATION" },
                                { label: "Legal (कानूनी)", value: "LEGAL" },
                                { label: "Material (सामग्री)", value: "MATERIAL" },
                                { label: "Other (अन्य)", value: "OTHER" }
                            ]}
                        />

                        <SelectField
                            label="Priority"
                            name="priority"
                            defaultValue="MEDIUM"
                            options={[
                                { label: "Low", value: "LOW" },
                                { label: "Medium", value: "MEDIUM" },
                                { label: "High", value: "HIGH" },
                                { label: "Urgent 🚨", value: "URGENT" }
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Due Date"
                            name="dueDate"
                            type="date"
                        />

                        <FormField
                            label="Est. Cost (NPR)"
                            name="estimatedCost"
                            type="number"
                            placeholder="0"
                        />
                    </div>

                    <FormField
                        label="Description / Instructions"
                        name="description"
                        placeholder="Add specific details or notes for the staff..."
                    />

                    {/* ACTION BUTTONS */}
                    <div className="
                        flex justify-end gap-3 pt-6 border-t
                        border-zinc-100 dark:border-zinc-800
                    ">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="border border-zinc-200 dark:border-zinc-700"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="
                                bg-zinc-900 dark:bg-zinc-100
                                text-white dark:text-zinc-900
                                font-bold px-8
                                hover:opacity-90
                            "
                        >
                            {isPending ? "Creating..." : "Save Action Item"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};