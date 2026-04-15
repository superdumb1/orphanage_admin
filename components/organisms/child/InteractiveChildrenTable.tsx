"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { EditChildModal } from "./EditChildModal";
import { ViewChildModal } from "./ViewChildModal";

export default function InteractiveChildrenTable({ children }: { children: any[] }) {
    const [editingChild, setEditingChild] = useState<any | null>(null);
    const [viewingChild, setViewingChild] = useState<any | null>(null);

    if (children.length === 0) {
        return <EmptyChildrenState />;
    }

    // Helper to format dates cleanly
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <TableHead />
                    <tbody className="divide-y divide-zinc-100">
                        {children.map((child) => (
                            <tr key={child._id} className="hover:bg-zinc-50/80 transition-colors group">

                                {/* 1. Name & Avatar (With safe fallback) */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {child.profileImageUrl ? (
                                            <img
                                                src={child.profileImageUrl}
                                                alt={`${child.firstName} ${child.lastName}`}
                                                className="w-10 h-10 rounded-full object-cover border border-zinc-200 shadow-sm shrink-0"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-black shadow-sm shrink-0">
                                                {child.firstName?.charAt(0) || "👤"}
                                            </div>
                                        )}
                                        <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                                            {child.firstName} {child.lastName}
                                        </span>
                                    </div>
                                </td>

                                {/* 2. Status Badge (Fixed p4 typo to p-4) */}
                                <td className="p-4">
                                    <ChildStatusBadge status={child.status} />
                                </td>

                                {/* 3. Admitted Date */}
                                <td className="p-4 text-xs font-medium text-zinc-600">
                                    {formatDate(child.admissionDate)}
                                </td>

                                {/* 4. Date of Birth */}
                                <td className="p-4 text-xs font-medium text-zinc-600">
                                    {formatDate(child.dateOfBirth)}
                                </td>

                                {/* 5. Actions */}
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setEditingChild(child)}
                                            className="text-xs font-bold text-zinc-500 bg-white hover:bg-amber-50 hover:text-amber-700 rounded-xl px-3 border border-zinc-200 shadow-sm hover:border-amber-200 transition-all"
                                        >
                                            ✏️ Edit
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            onClick={() => setViewingChild(child)} // ✨ Trigger View Modal
                                            className="text-xs font-bold text-zinc-500 bg-white hover:bg-blue-50 hover:text-blue-700 rounded-xl px-3 border border-zinc-200 shadow-sm hover:border-blue-200 transition-all"
                                        >
                                            👁️ View
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditChildModal
                onClose={() => setEditingChild(null)}
                child={editingChild}
            />
            <ViewChildModal
                isOpen={viewingChild !== null}
                onClose={() => setViewingChild(null)}
                child={viewingChild}
            />
        </>
    );
}

function ChildStatusBadge({ status }: { status: string }) {
    const statusMap: Record<string, { color: string, icon: string, label: string }> = {
        IN_CARE: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: "🏠", label: "In Care" },
        ADOPTED: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "🕊️", label: "Adopted" },
        FOSTERED: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: "🤝", label: "Fostered" },
        GRADUATED: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: "🎓", label: "Graduated" }
    };

    const config = statusMap[status] || {
        color: "bg-zinc-50 text-zinc-600 border-zinc-200",
        icon: "📌",
        label: status ? status.replace("_", " ") : "UNKNOWN"
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest shadow-sm ${config.color}`}>
            <span className="text-sm leading-none">{config.icon}</span>
            {config.label}
        </span>
    );
}

function EmptyChildrenState() {
    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden p-16 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-3xl shadow-sm border border-zinc-200">
                🧸
            </div>
            <div>
                <p className="text-zinc-900 font-bold">No children registered yet.</p>
                <p className="text-sm text-zinc-500 mt-1">Click "Admit Child" to create the first profile.</p>
            </div>
        </div>
    );
}

const TableHead = () => {
    return (
        <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Name & Profile
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Care Status
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Admitted
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        DOB
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">
                    Actions
                </th>
            </tr>
        </thead>
    );
}