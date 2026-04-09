"use client";
import React, { useActionState, useRef, useEffect } from "react";
import { quickUploadMedia } from "@/app/actions/child";

// 1. Define the state to match exactly what the Server Action returns
type ActionState =
    | { error: string; success: false }
    | { error: null; success: true }
    | { error: string | null; success: boolean }; // Catch-all for initial state

const initialState: ActionState = {
    error: null,
    success: false
};

export const QuickMediaUpload = ({ 
    childId, 
    type, 
    accept, 
    themeColor 
}: { 
    childId: string; 
    type: 'documents' | 'gallery'; 
    accept: string;
    themeColor: 'amber' | 'indigo';
}) => {
    // 2. Cast the action to 'any' here if TS still complains about argument counts.
    // React 19's useActionState can be finicky with specific Server Action signatures.
    const [state, formAction, isPending] = useActionState(quickUploadMedia as any, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    // 3. Reset form on success
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    const btnColor = themeColor === 'amber' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700';
    const fileColor = themeColor === 'amber' ? 'file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200' : 'file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200';

    return (
        <form 
            ref={formRef}
            action={formAction} 
            className="mt-auto pt-4 border-t border-white/40 flex flex-col gap-2"
        >
            {state?.error && (
                <p className="text-[10px] bg-red-100 text-red-700 p-1 px-2 rounded font-bold border border-red-200">
                    ⚠️ {state.error}
                </p>
            )}
            
            <input type="hidden" name="childId" value={childId} />
            <input type="hidden" name="uploadType" value={type} />
            
            <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-lg border border-white/60">
                <input
                    type="file"
                    name="files"
                    multiple
                    accept={accept}
                    required
                    className={`flex-1 text-xs text-zinc-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold cursor-pointer transition-colors ${fileColor}`}
                />
                <button 
                    type="submit" 
                    disabled={isPending} 
                    className={`py-1.5 px-4 text-xs font-bold text-white rounded-md shadow-sm disabled:opacity-50 transition-colors ${btnColor}`}
                >
                    {isPending ? "Uploading..." : "Quick Upload"}
                </button>
            </div>
        </form>
    );
};