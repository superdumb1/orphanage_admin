"use client";
import React, { useTransition } from "react";
import { uploadGuardianDoc } from "@/app/actions/guardian"; // We will build this next

export default function AddDocumentButton({ guardianId }: { guardianId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Package the file into FormData
        const formData = new FormData();
        formData.append("document", file);

        // Run the server action in a transition to show loading state
        startTransition(async () => {
            const result = await uploadGuardianDoc(guardianId, formData);
            if (result?.error) {
                alert(`Upload failed: ${result.error}`);
            }
        });
    };

    return (
        <label className={`cursor-pointer text-xs font-black px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-2 
            ${isPending ? 'bg-zinc-200 text-zinc-500 pointer-events-none' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            <span>{isPending ? "⏳ Uploading..." : "➕ Add Document"}</span>
            
            <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleUpload} 
                disabled={isPending} 
            />
        </label>
    );
}