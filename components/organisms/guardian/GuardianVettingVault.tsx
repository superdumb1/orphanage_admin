import React from "react";
import AddDocumentButton from "./AddDocumentButton";
import DocumentCard from "./DocumentCard";

export default function GuardianVettingVault({ guardian, id }: { guardian: any, id: string }) {
    return (
        <div className="bg-blue-50/30 p-6 rounded-[2rem] shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-100/50">
                <div className="flex items-center gap-3">
                    <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">🛡️</span>
                    <div>
                        <h2 className="text-lg font-black text-blue-900 tracking-tight">Verification Vault</h2>
                        <p className="text-xs text-blue-600 font-medium mt-0.5">Secure storage for background checks.</p>
                    </div>
                </div>
                <AddDocumentButton guardianId={id} />
            </div>

            {guardian.backgroundCheckDocs && guardian.backgroundCheckDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {guardian.backgroundCheckDocs.map((url: string, i: number) => (
                        <DocumentCard key={url} url={url} index={i} guardianId={id} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 border-2 border-dashed border-blue-200 rounded-2xl bg-white/50">
                    <span className="text-3xl opacity-50 block mb-2">📁</span>
                    <p className="text-sm text-blue-800 font-bold">No verification documents uploaded.</p>
                </div>
            )}
        </div>
    );
}