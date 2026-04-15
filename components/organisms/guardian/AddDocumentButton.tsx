"use client";
import React, { useTransition } from "react";
import { uploadGuardianDoc } from "@/app/actions/guardian";

export default function AddDocumentButton({ guardianId }: { guardianId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("document", file);

        startTransition(async () => {
            const result = await uploadGuardianDoc(guardianId, formData);

            if (result?.error) {
                alert(`Upload failed: ${result.error}`);
            }
        });

        // reset input so same file can be uploaded again
        e.target.value = "";
    };

    return (
        <label
            className={`
                cursor-pointer inline-flex items-center gap-2
                px-4 py-2 rounded-xl text-xs font-black
                border transition-all
                ${isPending
                    ? "bg-zinc-100 text-zinc-400 border-zinc-200 pointer-events-none"
                    : "bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200"
                }
            `}
        >
            <span>
                {isPending ? "⏳ Uploading..." : "➕ Add Document"}
            </span>

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