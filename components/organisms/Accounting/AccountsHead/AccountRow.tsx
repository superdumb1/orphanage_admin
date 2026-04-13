"use client";
import React from "react";

export const AccountRow = ({ head, theme }: { head: any, theme: string }) => {
    const themes: any = {
        emerald: 'border-emerald-100 hover:border-emerald-300 bg-white text-emerald-600',
        rose: 'border-rose-100 hover:border-rose-300 bg-white text-rose-600',
        blue: 'border-blue-100 hover:border-blue-300 bg-white text-blue-600',
        amber: 'border-amber-100 hover:border-amber-300 bg-white text-amber-600',
    };

    return (
        <div className={`group flex justify-between items-center p-4 rounded-2xl border shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 ${themes[theme]}`}>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-zinc-800">{head.name}</p>
                {head.description && <p className="text-[10px] text-zinc-500 italic leading-tight">{head.description}</p>}
            </div>
            <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded-md ${themes[theme].split(' ').pop()}`}>
                {head.code}
            </span>
        </div>
    );
};