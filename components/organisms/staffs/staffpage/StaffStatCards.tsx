import React from "react";

export default function StaffStatCards({ staffMembers }: { staffMembers: any[] }) {
    // Calculate stats
    const totalMonthlyPayroll = staffMembers.reduce((sum, s) => sum + s.grossSalary, 0);
    // Fixed the deep check for ssf.type based on your payload
    const ssfCount = staffMembers.filter(s => s.ssf?.type === "SSF").length;
    const pfCitCount = staffMembers.filter(s => s.ssf?.type === "PF_CIT").length;
    const activeCount = staffMembers.length;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            
            {/* Active */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-primary/30 shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg md:text-xl border border-primary/20 shrink-0">👥</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest">Active</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tighter leading-none">{activeCount}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">Total Employees / कुल कर्मचारी</div>
            </div>

            {/* Payroll */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-shaded text-text-muted flex items-center justify-center text-lg md:text-xl border border-border shrink-0">💵</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Payroll</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-text tracking-tighter leading-none truncate">Rs. {totalMonthlyPayroll.toLocaleString()}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">Monthly Payroll / मासिक कुल तलब</div>
            </div>

            {/* SSF */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-success/10 text-success flex items-center justify-center text-lg md:text-xl border border-success/20 shrink-0">🛡️</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">SSF</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tighter leading-none">{ssfCount}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">SSF Enrolled / SSF भर्ना</div>
            </div>

            {/* PF/CIT */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg md:text-xl border border-accent/20 shrink-0">🏦</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">PF/CIT</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tighter leading-none">{pfCitCount}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">PF/CIT Enrolled</div>
            </div>

        </div>
    );
}