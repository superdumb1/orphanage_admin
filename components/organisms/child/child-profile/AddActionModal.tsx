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
    childId: string 
}) => {
    const [state, formAction, isPending] = useActionState(createActionItem as any, { error: null, success: false });

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 animate-in zoom-in-95">
                
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-lg border border-orange-100 shadow-sm">
                            🎯
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900 text-lg tracking-tight">New Action Item</h2>
                            <p className="text-xs text-zinc-500 font-medium">Log a specific need or task for this child.</p>
                        </div>
                    </div>
                </div>

                <form action={formAction} className="p-6 flex flex-col gap-4">
                    <input type="hidden" name="childId" value={childId} />
                    
                    {state?.error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 font-bold">⚠️ {state.error}</p>}

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
                                { label: 'Medical (स्वास्थ्य)', value: 'MEDICAL' },
                                { label: 'Education (शिक्षा)', value: 'EDUCATION' },
                                { label: 'Legal (कानूनी)', value: 'LEGAL' },
                                { label: 'Material (सामग्री)', value: 'MATERIAL' },
                                { label: 'Other (अन्य)', value: 'OTHER' }
                            ]} 
                        />
                        <SelectField 
                            label="Priority" 
                            name="priority" 
                            defaultValue="MEDIUM"
                            options={[
                                { label: 'Low', value: 'LOW' },
                                { label: 'Medium', value: 'MEDIUM' },
                                { label: 'High', value: 'HIGH' },
                                { label: 'Urgent 🚨', value: 'URGENT' }
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

                    <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                        <Button type="button" variant="ghost" onClick={onClose} className="border border-zinc-200">Cancel</Button>
                        <Button 
                            type="submit" 
                            disabled={isPending} 
                            className="bg-zinc-900 text-white font-bold px-8"
                        >
                            {isPending ? "Creating..." : "Save Action Item"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};