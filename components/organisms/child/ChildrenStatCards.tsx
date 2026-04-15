import React from "react";

export default function ChildrenStatCards({ children }: { children: any[] }) {
    // 🧮 Calculate the live metrics
    const totalRecords = children.length;
    
    const inCare = children.filter(child => 
        child.status === "IN_CARE"
    ).length;

    const placed = children.filter(child => 
        child.status === "ADOPTED" || child.status === "FOSTERED"
    ).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAdmissions = children.filter(child => 
        new Date(child.admissionDate) >= thirtyDaysAgo
    ).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Actively In Care (Primary Metric) */}
            <div className="bg-card p-5 rounded-[1.5rem] border border-primary/30 shadow-sm hover:shadow-glow transition-all flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    {/* ✨ Uses primary/10 for a smart translucent tint */}
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl border border-primary/20">
                        🏠
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Active
                    </span>
                </div>
                <span className="text-3xl font-black text-text tracking-tighter">
                    {inCare}
                </span>
                <span className="text-xs text-text-muted font-medium mt-1">
                    Children currently in care
                </span>
            </div>

            {/* Total Historical Records (Neutral) */}
            <div className="bg-card p-5 rounded-[1.5rem] border border-border shadow-sm hover:border-text/30 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-shaded text-text-muted flex items-center justify-center text-xl border border-border">
                        🗂️
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                        Total
                    </span>
                </div>
                <span className="text-3xl font-black text-text tracking-tighter">
                    {totalRecords}
                </span>
                <span className="text-xs text-text-muted font-medium mt-1">
                    Lifetime registry records
                </span>
            </div>

            {/* Successfully Placed (Success Metric) */}
            <div className="bg-card p-5 rounded-[1.5rem] border border-border hover:border-success/30 shadow-sm transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center text-xl border border-success/20">
                        🕊️
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                        Placed
                    </span>
                </div>
                <span className="text-3xl font-black text-text tracking-tighter">
                    {placed}
                </span>
                <span className="text-xs text-text-muted font-medium mt-1">
                    Adopted or fostered
                </span>
            </div>

            {/* Recent Admissions (Accent/Notice Metric) */}
            <div className="bg-card p-5 rounded-[1.5rem] border border-border hover:border-accent/30 shadow-sm transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl border border-accent/20">
                        🌟
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                        New
                    </span>
                </div>
                <span className="text-3xl font-black text-text tracking-tighter">
                    {recentAdmissions}
                </span>
                <span className="text-xs text-text-muted font-medium mt-1">
                    Admissions in last 30 days
                </span>
            </div>

        </div>
    );
}