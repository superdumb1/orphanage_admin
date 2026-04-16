"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { ViewChildModal } from "../../modals/child/ViewChildModal";
import { useUIModals } from "@/hooks/useUIModal";

export default function InteractiveChildrenTable({ children }: { children: any[] }) {
    const { openChildModal, openChildProfile } = useUIModals()
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
            {/* ✨ Themed Container */}
            <div className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden transition-colors duration-500">
                <table className="w-full text-left border-collapse">
                    <TableHead />
                    <tbody className="divide-y divide-border">
                        {children.map((child) => (
                            <tr key={child._id} className="hover:bg-shaded/80 transition-colors group">

                                {/* 1. Name & Avatar */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {child.profileImageUrl ? (
                                            <img
                                                src={child.profileImageUrl}
                                                alt={`${child.firstName} ${child.lastName}`}
                                                className="w-10 h-10 rounded-full object-cover border border-border shadow-sm shrink-0"
                                            />
                                        ) : (
                                            /* ✨ Themed Avatar Fallback using primary with opacity */
                                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-black shadow-sm shrink-0">
                                                {child.firstName?.charAt(0) || "👤"}
                                            </div>
                                        )}
                                        {/* ✨ Themed Text */}
                                        <span className="font-bold text-text group-hover:text-primary transition-colors">
                                            {child.firstName} {child.lastName}
                                        </span>
                                    </div>
                                </td>

                                {/* 2. Status Badge */}
                                <td className="p-4">
                                    <ChildStatusBadge status={child.status} />
                                </td>

                                {/* 3. Admitted Date */}
                                <td className="p-4 text-xs font-medium text-text-muted">
                                    {formatDate(child.admissionDate)}
                                </td>

                                {/* 4. Date of Birth */}
                                <td className="p-4 text-xs font-medium text-text-muted">
                                    {formatDate(child.dateOfBirth)}
                                </td>

                                {/* 5. Actions */}
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* ✨ Themed Edit Button (Warning/Amber tint on hover) */}
                                        <Button
                                            variant="ghost"
                                            onClick={() => openChildModal(child)}
                                            className="text-xs font-bold text-text-muted bg-card hover:bg-warning/10 hover:text-warning rounded-xl px-3 border border-border shadow-sm hover:border-warning/30 transition-all"
                                        >
                                            ✏️ Edit
                                        </Button>

                                        {/* ✨ Themed View Button (Primary/Blue tint on hover) */}
                                        <Button
                                            variant="ghost"
                                            onClick={() => openChildProfile(child)}
                                            className="text-xs font-bold text-text-muted bg-card hover:bg-primary/10 hover:text-primary rounded-xl px-3 border border-border shadow-sm hover:border-primary/30 transition-all"
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


    
        </>
    );
}

// ✨ Status Badge using your semantic State Colors
function ChildStatusBadge({ status }: { status: string }) {
    const statusMap: Record<string, { color: string, icon: string, label: string }> = {
        IN_CARE: { color: "bg-primary/10 text-primary border-primary/20", icon: "🏠", label: "In Care" },
        ADOPTED: { color: "bg-success/10 text-success border-success/20", icon: "🕊️", label: "Adopted" },
        FOSTERED: { color: "bg-accent/10 text-accent border-accent/20", icon: "🤝", label: "Fostered" },
        GRADUATED: { color: "bg-warning/10 text-warning border-warning/20", icon: "🎓", label: "Graduated" }
    };

    const config = statusMap[status] || {
        color: "bg-shaded text-text-muted border-border",
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

// ✨ Empty State using semantic colors
function EmptyChildrenState() {
    return (
        <div className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden p-16 text-center flex flex-col items-center gap-3 transition-colors duration-500">
            <div className="w-16 h-16 bg-shaded rounded-full flex items-center justify-center text-3xl shadow-sm border border-border text-text-muted">
                🧸
            </div>
            <div>
                <p className="text-text font-bold">No children registered yet.</p>
                <p className="text-sm text-text-muted mt-1">Click "Admit Child" to create the first profile.</p>
            </div>
        </div>
    );
}

// ✨ Table Head using shaded backgrounds and muted text
const TableHead = () => {
    return (
        <thead>
            <tr className="bg-shaded/50 border-b border-border">
                <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Name & Profile
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Care Status
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Admitted
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        DOB
                    </div>
                </th>
                <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">
                    Actions
                </th>
            </tr>
        </thead>
    );
}