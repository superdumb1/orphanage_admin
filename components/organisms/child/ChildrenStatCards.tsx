import React from "react";

export default function ChildrenStatCards({ children }: { children: any[] }) {
    // 🧮 Calculate the live metrics
    const totalRecords = children.length;
    
    // Count children actively living at the orphanage
    const inCare = children.filter(child => 
        child.status === "IN_CARE"
    ).length;

    // Count children who have been successfully placed in homes
    const placed = children.filter(child => 
        child.status === "ADOPTED" || child.status === "FOSTERED"
    ).length;

    // Count children admitted in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAdmissions = children.filter(child => 
        new Date(child.admissionDate) >= thirtyDaysAgo
    ).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Actively In Care (Primary Metric) */}
            <div className="bg-white p-5 rounded-[1.5rem] border border-blue-200 shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl border border-blue-100">
                        🏠
                    </div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        Active
                    </span>
                </div>
                <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                    {inCare}
                </span>
                <span className="text-xs text-zinc-500 font-medium mt-1">
                    Children currently in care
                </span>
            </div>

            {/* Total Historical Records */}
            <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 text-zinc-500 flex items-center justify-center text-xl border border-zinc-100">
                        🗂️
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Total
                    </span>
                </div>
                <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                    {totalRecords}
                </span>
                <span className="text-xs text-zinc-500 font-medium mt-1">
                    Lifetime registry records
                </span>
            </div>

            {/* Successfully Placed */}
            <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl border border-emerald-100">
                        🕊️
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Placed
                    </span>
                </div>
                <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                    {placed}
                </span>
                <span className="text-xs text-zinc-500 font-medium mt-1">
                    Adopted or fostered
                </span>
            </div>

            {/* Recent Admissions (Alert/Notice) */}
            <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl border border-purple-100">
                        🌟
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        New
                    </span>
                </div>
                <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                    {recentAdmissions}
                </span>
                <span className="text-xs text-zinc-500 font-medium mt-1">
                    Admissions in last 30 days
                </span>
            </div>

        </div>
    );
}