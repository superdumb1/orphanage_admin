import { useActionState, useEffect } from "react";
import { FormField } from "../molecules/FormField";
import { SelectField } from "../molecules/SelectField";
import { Button } from "../atoms/Button";
import { AddCatagory } from "@/app/actions/catagory";

const CategoryForm = ({ onClose }: { onClose: () => void }) => {
    const [state, formAction, isPending] = useActionState(AddCatagory, { error: null, success: false });

    useEffect(() => {
        if (state.success) {
            onClose();
        }
    }, [state.success, onClose]);

    return (
        <form className="p-5 flex flex-col gap-5" action={formAction}>
            {state.error && (
                <p className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
                    ⚠️ {state.error}
                </p>
            )}

            <FormField label="Category Name *" name="categoryName" required placeholder="e.g. Medical, Food" />
            
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Account Code" name="accountCode" placeholder="Optional" />
                <SelectField 
                    label="Type" 
                    name="categoryType" 
                    defaultValue="EXPENSE"
                    options={[
                        { label: 'Expense', value: 'EXPENSE' },
                        { label: 'Income', value: 'INCOME' }
                    ]} 
                />
            </div>

            <FormField label="Description" name="description" />

            <div className="flex justify-end gap-3 border-t pt-5 mt-2">
                <Button type="button" variant="ghost" onClick={onClose} className="border border-zinc-200">
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {isPending ? "Saving..." : "Save Category"}
                </Button>
            </div>
        </form>
    );
};

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h2 className="font-bold text-zinc-900 text-lg tracking-tight">Add New Category</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 text-xl">✕</button>
                </div>

                {/* Form Shell */}
                <CategoryForm onClose={onClose} />
            </div>
        </div>
    );
};