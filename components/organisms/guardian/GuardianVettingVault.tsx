import React from "react";
import AddDocumentButton from "./AddDocumentButton";
import DocumentCard from "./DocumentCard";

export default function GuardianVettingVault({
    guardian,
    id
}: {
    guardian: any;
    id: string;
}) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">

                <div className="flex items-center gap-3">

                    <span className="text-xl w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200">
                        🛡️
                    </span>

                    <div>
                        <h2 className="text-lg font-black text-zinc-900 tracking-tight">
                            Verification Vault
                        </h2>
                        <p className="text-xs text-zinc-500 font-medium">
                            Secure storage for background checks
                        </p>
                    </div>
                </div>

                <AddDocumentButton guardianId={id} />
            </div>

            {/* DOCUMENTS */}
            {guardian?.backgroundCheckDocs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {guardian.backgroundCheckDocs.map((url: string, i: number) => (
                        <DocumentCard
                            key={url}
                            url={url}
                            index={i}
                            guardianId={id}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">

                    <span className="text-3xl opacity-40 block mb-2">
                        📁
                    </span>

                    <p className="text-sm text-zinc-500 font-medium">
                        No verification documents uploaded
                    </p>
                </div>
            )}
        </div>
    );
}