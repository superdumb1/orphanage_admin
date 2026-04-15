"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { AccountRow } from "./AccountRow";

export const AccountSection = ({
  title,
  heads,
  theme,
  subTypes,
  onAdd
}: any) => {
  const bgColors: any = {
    emerald: "bg-emerald-50/30 dark:bg-emerald-950/20",
    rose: "bg-rose-50/30 dark:bg-rose-950/20",
    blue: "bg-blue-50/30 dark:bg-blue-950/20",
    amber: "bg-amber-50/30 dark:bg-amber-950/20"
  };

  const textColors: any = {
    emerald: "text-emerald-500 dark:text-emerald-400",
    rose: "text-rose-500 dark:text-rose-400",
    blue: "text-blue-500 dark:text-blue-400",
    amber: "text-amber-500 dark:text-amber-400"
  };

  return (
    <div
      className={`
        ${bgColors[theme]}
        p-8 rounded-[2.5rem]
        border border-zinc-100 dark:border-zinc-800
        h-full
      `}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="
          text-sm font-black uppercase tracking-[0.2em]
          text-zinc-400 dark:text-zinc-500
        ">
          {title}
        </h2>

        <Button
          onClick={onAdd}
          className="h-8 text-[10px] font-bold px-4"
        >
          + Add Head
        </Button>
      </div>

      {/* CONTENT */}
      <div className="space-y-8">
        {subTypes.map((sub: string) => {
          const filtered = heads.filter((h: any) =>
            h.subType?.includes(sub)
          );

          if (!filtered.length) return null;

          return (
            <div key={sub} className="space-y-3">
              
              <h3
                className={`
                  text-[10px] font-black uppercase tracking-widest px-2
                  ${textColors[theme]}
                `}
              >
                {sub}
              </h3>

              <div className="space-y-2">
                {filtered.map((head: any) => (
                  <AccountRow
                    key={head._id}
                    head={head}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};