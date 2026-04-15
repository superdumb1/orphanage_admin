"use client";
import React, { useState, useTransition } from "react";
import { deleteGuardianDoc } from "@/app/actions/guardian";

interface DocumentCardProps {
    url: string;
    index: number;
    guardianId: string;
}

export default function DocumentCard({
    url,
    index,
    guardianId
}: DocumentCardProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!window.confirm("Delete this document?")) return;

        startTransition(async () => {
            const result = await deleteGuardianDoc(guardianId, url);
            if (result?.error) alert(result.error);
        });
    };

    return (
        <>
            {/* CARD: Updated bg-white -> bg-card, border-zinc-200 -> border-border */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl p-3 hover:shadow-md hover:border-primary/30 transition-all duration-300 group">

                {/* OPEN PREVIEW */}
                <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                    {/* Icon: Updated text-zinc-500 -> text-text-muted, hover to primary */}
                    <span className="text-text-muted group-hover:text-primary transition-colors grayscale group-hover:grayscale-0">
                        📄
                    </span>

                    {/* Typography: Updated text-zinc-900 -> text-text */}
                    <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                        Document {index + 1}
                    </span>
                </button>

                {/* DELETE: Updated hover:bg-rose-50 -> hover:bg-danger/10, text-rose-600 -> text-danger */}
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-danger/10 hover:text-danger transition-colors disabled:opacity-50"
                    title="Delete Document"
                >
                    {isPending ? "⏳" : "🗑️"}
                </button>
            </div>

            {/* PREVIEW MODAL */}
            {isPreviewOpen && (
                // Backdrop: Updated bg-zinc-900/70 -> bg-bg-invert/20
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in">

                    {/* Modal Shell: bg-white -> bg-card, border-zinc-200 -> border-border */}
                    <div className="bg-card w-full max-w-5xl h-[85vh] rounded-dashboard flex flex-col overflow-hidden shadow-glow border border-border transition-colors duration-500 animate-in zoom-in-95">

                        {/* HEADER: Updated bg-zinc-50 -> bg-shaded/50 */}
                        <div className="flex items-center justify-between p-5 md:px-6 border-b border-border bg-shaded/50 shrink-0">

                            <div>
                                <h3 className="font-black text-text text-lg tracking-tight">
                                    Document Preview
                                </h3>

                                {/* Subtitle: Upgraded to micro-caps aesthetic */}
                                <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-0.5">
                                    Document {index + 1}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">

                                {/* Open Button: Upgraded to use your btn-primary utility */}
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary py-2 px-5 text-xs"
                                >
                                    Open ↗
                                </a>

                                {/* Close Button: Styled to match inventory modal */}
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-shaded hover:border-border border border-transparent text-text-muted hover:text-text transition-all active:scale-95"
                                >
                                    ✕
                                </button>

                            </div>
                        </div>

                        {/* BODY: Updated bg-zinc-50 -> bg-shaded */}
                        <div className="flex-1 bg-shaded p-4 md:p-6 custom-scrollbar">

                            {/* Iframe: Kept bg-white intentionally so PDFs/Docs remain readable regardless of theme */}
                            <iframe
                                src={url}
                                className="w-full h-full rounded-2xl bg-white border border-border shadow-sm"
                                title={`Document ${index + 1}`}
                            />

                        </div>

                    </div>
                </div>
            )}
        </>
    );
}