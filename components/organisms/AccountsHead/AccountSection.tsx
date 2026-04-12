"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { AccountRow } from "./AccountRow";

export const AccountSection = ({ title, heads, theme, subTypes, onAdd }: any) => {
    const bgColors: any = { emerald: 'bg-emerald-50/30', rose: 'bg-rose-50/30', blue: 'bg-blue-50/30', amber: 'bg-amber-50/30' };
    const textColors: any = { emerald: 'text-emerald-500', rose: 'text-rose-500', blue: 'text-blue-500', amber: 'text-amber-500' };

    return (
        <div className={`${bgColors[theme]} p-8 rounded-[2.5rem] border border-zinc-100 h-full`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">{title}</h2>
                <Button onClick={onAdd} className="h-8 text-[10px] font-bold px-4">+ Add Head</Button>
            </div>

            <div className="space-y-8">
                {subTypes.map((sub: string) => {
                    const filtered = heads.filter((h: any) => h.subType.includes(sub));
                    if (filtered.length === 0) return null;

                    return (
                        <div key={sub} className="space-y-3">
                            <h3 className={`text-[10px] font-black uppercase tracking-widest px-2 ${textColors[theme]}`}>{sub}</h3>
                            <div className="space-y-2">
                                {filtered.map((head: any) => <AccountRow key={head._id} head={head} theme={theme} />)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};