"use client";

import React from "react";

export default function InfoRow({
    label,
    value,
    isBold = false,
}: {
    label: string;
    value: string | number;
    isBold?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1 transition-colors duration-500">

            {/* LABEL: Updated text-zinc-400 -> text-text-muted */}
            <p className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                {label}
            </p>

            {/* VALUE: Updated text-zinc-900 -> text-text, text-zinc-700 -> text-text/80 */}
            <p
                className={`text-sm transition-colors ${
                    isBold
                        ? "font-black text-text"
                        : "font-medium text-text/80"
                }`}
            >
                {value ?? "—"}
            </p>
        </div>
    );
}