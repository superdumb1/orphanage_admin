"use client";
import React from "react";

export const AccountRow = ({
  head,
  theme
}: {
  head: any;
  theme: "emerald" | "rose" | "blue" | "amber";
}) => {
  const themes: Record<string, string> = {
    emerald:
      "border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-700",
    rose:
      "border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:border-rose-400 dark:hover:border-rose-700",
    blue:
      "border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-700",
    amber:
      "border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 hover:border-amber-400 dark:hover:border-amber-700"
  };

  const baseCard =
    "group flex justify-between items-center p-4 rounded-2xl border shadow-sm transition-all cursor-pointer hover:-translate-y-0.5";

  const textBase =
    "text-zinc-800 dark:text-zinc-100";

  const descText =
    "text-[10px] text-zinc-500 dark:text-zinc-400 italic leading-tight";

  return (
    <div className={`${baseCard} bg-white dark:bg-zinc-950 ${themes[theme]}`}>
      
      <div className="flex flex-col gap-1">
        <p className={`text-sm font-bold ${textBase}`}>
          {head.name}
        </p>

        {head.description && (
          <p className={descText}>
            {head.description}
          </p>
        )}
      </div>

      <span className="
        text-[9px] font-black font-mono px-2 py-0.5 rounded-md
        bg-zinc-100 dark:bg-zinc-800
        text-zinc-700 dark:text-zinc-300
        border border-zinc-200 dark:border-zinc-700
      ">
        {head.code}
      </span>
    </div>
  );
};