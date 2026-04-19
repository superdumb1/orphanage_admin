import React from "react";

export default function ChildrenStatCards({ children }: { children: any[] }) {
    // 🧮 Calculate the live metrics
    const totalRecords = children.length;
    const inCare = children.filter(child => child.status === "IN_CARE").length;
    const placed = children.filter(child => child.status === "ADOPTED" || child.status === "FOSTERED").length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAdmissions = children.filter(child => new Date(child.admissionDate) >= thirtyDaysAgo).length;

    return (
        // ✨ Ultra-tight mobile gap (gap-2), standard desktop gap (md:gap-4)
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            
            {/* Active */}
            {/* ✨ Removed flex flex-col to prevent vertical stretching. Tightened mobile padding to p-3 */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-primary/30 shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg md:text-xl border border-primary/20 shrink-0">🏠</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest">Active</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tighter leading-none">{inCare}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">Children currently in care</div>
            </div>

            {/* Total */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-shaded text-text-muted flex items-center justify-center text-lg md:text-xl border border-border shrink-0">🗂️</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Total</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tighter leading-none">{totalRecords}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">Lifetime registry records</div>
            </div>

            {/* Placed */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-success/10 text-success flex items-center justify-center text-lg md:text-xl border border-success/20 shrink-0">🕊️</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Placed</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tighter leading-none">{placed}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">Adopted or fostered</div>
            </div>

            {/* Recent */}
            <div className="bg-card p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg md:text-xl border border-accent/20 shrink-0">🌟</div>
                    <span className="font-ubuntu text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">New</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tighter leading-none">{recentAdmissions}</div>
                <div className="hidden md:block font-ubuntu text-xs text-text-muted mt-2">Admissions in last 30 days</div>
            </div>

        </div>
    );
}