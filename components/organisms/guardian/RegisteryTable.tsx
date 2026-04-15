"use client";
import React from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import VettingBadge from "@/components/organisms/guardian/VettingBadge";

export function RegistryTableRow({ guardian }: { guardian: any }) {
    return (
        <tr className="
            /* FORCE: Use your theme tokens only */
            !bg-card 
            hover:bg-shaded/80 
            transition-all 
            group 
            border-b border-border/20 
            last:border-0
        ">
            <td className="p-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl border border-border bg-bg flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/40 transition-all">
                        {guardian.profileImageUrl ? (
                            <img src={guardian.profileImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User className="text-text-muted opacity-30 w-6 h-6" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-text group-hover:text-primary transition-colors text-sm">
                            {guardian.primaryName}
                        </span>
                        <span className="text-[11px] text-text-muted font-bold opacity-70">
                            {guardian.phone}
                        </span>
                    </div>
                </div>
            </td>
            <td className="p-5">
                <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                    {guardian.type}
                </span>
            </td>
            <td className="p-5">
                <VettingBadge status={guardian.vettingStatus} />
            </td>
            <td className="p-5">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-text bg-shaded w-8 h-8 rounded-xl border border-border/50 flex items-center justify-center shadow-inner">
                        {guardian.assignedChildren?.length || 0}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase font-black tracking-widest opacity-60">
                        Placed
                    </span>
                </div>
            </td>
            <td className="p-5 text-right">
                <Link href={`/guardians/${guardian._id}`}>
                    <Button variant="ghost" size="sm" className="border border-border bg-bg group-hover:text-primary rounded-xl">
                        View Dossier →
                    </Button>
                </Link>
            </td>
        </tr>
    );
}