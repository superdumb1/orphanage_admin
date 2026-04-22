"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/atoms/Button";
import { useUIModals } from "@/hooks/useUIModal";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

export default function InteractiveStaffTable({ staffMembers }: { staffMembers: any[] }) {
    const { openStaffForm } = useUIModals();
    
    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("ALL");
    
    // Get unique departments for the dropdown
    const departments = useMemo(() => {
        const depts = new Set(staffMembers.map(s => s.department).filter(Boolean));
        return Array.from(depts);
    }, [staffMembers]);
    
    // Filtering Logic
    const filteredStaff = useMemo(() => {
        return staffMembers.filter((person) => {
            const nameMatch = person.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
            const deptMatch = deptFilter === "ALL" || person.department === deptFilter;
            return nameMatch && deptMatch;
        });
    }, [staffMembers, searchTerm, deptFilter]);

    if (staffMembers.length === 0) return <EmptyStaffState />;

    return (
        <div className="flex flex-col gap-4">
            {/* =========================================
                THE FILTER TOOLBAR
                ========================================= */}
            <div className="flex flex-col sm:flex-row gap-3 bg-card p-3 rounded-[1.5rem] border border-border shadow-sm">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search employee by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border/50 text-text placeholder:text-text-muted text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                    />
                </div>

                {/* Department Dropdown */}
                <div className="relative shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                        <Filter size={16} />
                    </div>
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="w-full sm:w-48 bg-background border border-border/50 text-text text-sm rounded-xl pl-10 pr-10 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer shadow-inner font-bold capitalize"
                    >
                        <option value="ALL">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept as string} value={dept as string}>
                                {(dept as string).replace("_", " ")}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-muted">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* No Results State */}
            {filteredStaff.length === 0 && (
                <div className="bg-card p-12 rounded-[2rem] border border-border text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-shaded rounded-full flex items-center justify-center text-text-muted mb-2">🔍</div>
                    <p className="text-text font-bold text-lg">No employees found</p>
                    <p className="text-text-muted text-sm">Adjust your search or department filters.</p>
                    <Button variant="ghost" onClick={() => { setSearchTerm(""); setDeptFilter("ALL"); }} className="mt-4 text-primary hover:bg-primary/10">
                        Clear Filters
                    </Button>
                </div>
            )}

            {/* =========================================
                DESKTOP VIEW (Hidden on Mobile) 
                ========================================= */}
            {filteredStaff.length > 0 && (
                <div className="hidden md:block bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden transition-colors duration-500">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <TableHead />
                            <tbody className="divide-y divide-border">
                                {filteredStaff.map((person) => (
                                    <tr key={person._id} className="hover:bg-shaded/80 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar person={person} />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-text group-hover:text-primary transition-colors capitalize">
                                                        {person.fullName}
                                                        {person.nepaliName && <span className="font-normal text-text-muted text-[10px] ml-2 italic">({person.nepaliName})</span>}
                                                    </span>
                                                    <span className="text-[11px] text-text-muted/70">{person.email} • {person.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text/90 text-xs">{person.designation || 'Not Assigned'}</span>
                                                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{person.department?.replace("_", " ") || 'General'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 flex flex-col gap-1 items-start">
                                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                                {person.employmentType?.replace("_", " ") || 'ACTIVE'}
                                            </span>
                                            
                                            {/* ✨ FIX: Updated to check enrolled status */}
                                            {person.ssf?.enrolled && (
                                                <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-black border border-accent/20 uppercase tracking-tighter">SSF Enrolled</span>
                                            )}

                                            {/* ✨ NEW: System Access Badge */}
                                            {person.userId && (
                                                <span className="px-2 py-0.5 rounded-md bg-warning/10 text-warning text-[10px] font-black border border-warning/20 uppercase tracking-tighter">System Access</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right font-black text-success tabular-nums">
                                            {person.grossSalary > 0 ? `Rs. ${person.grossSalary.toLocaleString()}` : 'Not Set'}
                                        </td>
                                        <td className="p-4">
                                            <ActionButtons person={person} openStaffForm={openStaffForm} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* =========================================
                MOBILE VIEW (Individual Floating Cards)
                ========================================= */}
            {filteredStaff.length > 0 && (
                <div className="flex flex-col md:hidden">
                    {filteredStaff.map((person, index) => (
                        <div 
                            key={person._id} 
                            className={`border border-border shadow-sm flex flex-col overflow-hidden transition-all ${
                                index % 2 === 0 ? "bg-card" : "bg-alt"
                            }`}
                        >
                            <div className="p-5 flex items-center gap-4 border-b border-border ">
                                <div className="shrink-0">
                                    <Avatar person={person} className="w-14 h-14 text-lg" />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0 gap-1">
                                    <h3 className="font-black text-text text-xl tracking-tight truncate leading-none capitalize">
                                        {person.fullName}
                                    </h3>
                                    <span className="text-xs font-bold text-text-muted truncate">
                                        {person.designation || 'Not Assigned'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-2xl border border-border shadow-inner">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-ubuntu text-[9px] font-black text-text-muted uppercase tracking-widest">Department</span>
                                        <span className="text-xs font-bold text-text truncate capitalize">{person.department?.replace("_", " ") || 'General'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-ubuntu text-[9px] font-black text-text-muted uppercase tracking-widest">Gross Salary</span>
                                        <span className="text-xs font-black text-success tabular-nums">
                                            {person.grossSalary > 0 ? `Rs. ${person.grossSalary.toLocaleString()}` : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        {person.employmentType?.replace("_", " ") || 'ACTIVE'}
                                    </span>
                                    
                                    {/* ✨ FIX: Updated to check enrolled status */}
                                    {person.ssf?.enrolled && (
                                        <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-black border border-accent/20 uppercase tracking-widest">SSF</span>
                                    )}

                                    {/* ✨ NEW: System Access Badge */}
                                    {person.userId && (
                                        <span className="px-2.5 py-1 rounded-md bg-warning/10 text-warning text-[10px] font-black border border-warning/20 uppercase tracking-widest">Access</span>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <ActionButtons person={person} openStaffForm={openStaffForm} mobile />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* =========================================
   REUSABLE SUB-COMPONENTS
   ========================================= */

const Avatar = ({ person, className = "w-10 h-10 text-sm" }: { person: any, className?: string }) => {
    if (person.profileImageUrl) {
        return <img src={person.profileImageUrl} alt={person.fullName} className={`${className} rounded-full object-cover border border-border shadow-sm`} />;
    }
    return <div className={`${className} rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger font-black shadow-sm uppercase`}>{person.fullName?.charAt(0) || "👤"}</div>;
};

const ActionButtons = ({ person, openStaffForm, mobile = false }: { person: any, openStaffForm: any, mobile?: boolean }) => (
    <div className={`flex items-center gap-2 ${mobile ? 'w-full' : 'justify-end'}`}>
        <Button 
            variant="ghost" 
            onClick={() => openStaffForm({ staff: person })} 
            className={`${mobile ? 'flex-1 py-3 bg-surface' : 'px-3 bg-card'} text-xs font-bold text-text-muted hover:bg-warning/10 hover:text-warning rounded-xl border border-border shadow-sm hover:border-warning/30 transition-all flex justify-center items-center gap-2`}
        >
            ✏️ Edit
        </Button>
        <Link href={`/staff/${person._id.toString()}`} className={mobile ? 'flex-1' : ''}>
            <Button 
                variant="ghost" 
                className={`${mobile ? 'w-full py-3 bg-primary text-text-invert' : 'px-4 py-1.5 bg-card text-text-muted hover:bg-bg hover:text-text'} text-[10px] font-black uppercase tracking-widest border border-border shadow-sm transition-all flex justify-center items-center gap-2`}
            >
                {mobile ? '👁️ View' : 'Manage'}
            </Button>
        </Link>
    </div>
);

const TableHead = () => (
    <thead>
        <tr className="bg-shaded/50 border-b border-border">
            <th className="p-5 font-ubuntu text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Employee Details</th>
            <th className="p-5 font-ubuntu text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Designation & Dept</th>
            <th className="p-5 font-ubuntu text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Employment</th>
            <th className="p-5 font-ubuntu text-[10px] font-black text-text-muted uppercase tracking-widest text-right whitespace-nowrap">Gross Salary (NPR)</th>
            <th className="p-5 font-ubuntu text-[10px] font-black text-text-muted uppercase tracking-widest text-right whitespace-nowrap pr-8">Actions</th>
        </tr>
    </thead>
);

function EmptyStaffState() {
    return (
        <div className="bg-card p-20 rounded-[2rem] border border-border text-center flex flex-col items-center gap-2 shadow-sm">
            <span className="text-4xl grayscale opacity-50 mb-4">📂</span>
            <p className="text-lg font-black text-text uppercase tracking-tighter">Database Empty</p>
            <p className="text-sm text-text-muted">No personnel files found in the current directive.</p>
        </div>
    );
}