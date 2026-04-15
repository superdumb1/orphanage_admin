"use client";
import React, { useState, useTransition } from "react";
import { deleteGuardianDoc } from "@/app/actions/guardian";

interface DocumentCardProps {
    url: string;
    index: number;
    guardianId: string;
}

export default function DocumentCard({ url, index, guardianId }: DocumentCardProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!window.confirm("Are you sure you want to delete this verification document?")) return;
        
        startTransition(async () => {
            const result = await deleteGuardianDoc(guardianId, url);
            if (result?.error) alert(result.error);
        });
    };

    return (
        <>
            {/* --- THE CARD --- */}
            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group">
                
                {/* Clicking the left side opens the preview */}
                <button 
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center gap-3 flex-1 text-left px-2 py-1"
                >
                    <span className="text-blue-500 group-hover:scale-110 transition-transform">📄</span>
                    <span className="text-sm font-bold text-blue-800 uppercase tracking-tight">
                        Verified Doc {index + 1}
                    </span>
                </button>

                {/* Clicking the right side deletes it */}
                <button 
                    onClick={handleDelete}
                    disabled={isPending}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                    title="Delete Document"
                >
                    {isPending ? "⏳" : "🗑️"}
                </button>
            </div>

            {/* --- THE PREVIEW MODAL --- */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50 shrink-0">
                            <div>
                                <h3 className="font-black text-zinc-900 tracking-tighter text-lg">Document Preview</h3>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Verified Doc {index + 1}</p>
                            </div>
                            <div className="flex gap-2">
                                {/* Allows them to download or open full screen natively */}
                                <a href={url} target="_blank" rel="noreferrer" className="px-4 py-2 text-xs font-bold bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl transition-colors">
                                    Open in New Tab ↗
                                </a>
                                <button onClick={() => setIsPreviewOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 transition-colors">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Body (Iframe handles both PDFs and Images gracefully) */}
                        <div className="flex-1 bg-zinc-200/50 p-4">
                            <iframe 
                                src={url} 
                                className="w-full h-full rounded-xl bg-white border border-zinc-200 shadow-sm"
                                title={`Document Preview ${index + 1}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}