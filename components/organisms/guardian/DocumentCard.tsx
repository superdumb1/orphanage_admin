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
            {/* CARD */}
            <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-2xl p-3 hover:shadow-sm hover:border-zinc-300 transition-all group">

                {/* OPEN PREVIEW */}
                <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                    <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">
                        📄
                    </span>

                    <span className="text-sm font-bold text-zinc-900">
                        Document {index + 1}
                    </span>
                </button>

                {/* DELETE */}
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                    title="Delete Document"
                >
                    {isPending ? "⏳" : "🗑️"}
                </button>
            </div>

            {/* PREVIEW MODAL */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/70 backdrop-blur-sm p-4">

                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-zinc-200">

                        {/* HEADER */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-zinc-50 shrink-0">

                            <div>
                                <h3 className="font-black text-zinc-900 text-lg tracking-tight">
                                    Document Preview
                                </h3>

                                <p className="text-xs text-zinc-500 font-medium mt-1">
                                    Document {index + 1}
                                </p>
                            </div>

                            <div className="flex gap-2">

                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 text-xs font-bold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                                >
                                    Open ↗
                                </a>

                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
                                >
                                    ✕
                                </button>

                            </div>
                        </div>

                        {/* BODY */}
                        <div className="flex-1 bg-zinc-50 p-4">

                            <iframe
                                src={url}
                                className="w-full h-full rounded-2xl bg-white border border-zinc-200"
                                title={`Document ${index + 1}`}
                            />

                        </div>

                    </div>
                </div>
            )}
        </>
    );
}