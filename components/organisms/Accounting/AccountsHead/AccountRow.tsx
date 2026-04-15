"use client";
import React from "react";

export const AccountRow = ({
  head,
  theme // Expects: "success" | "danger" | "primary" | "warning"
}: {
  head: any;
  theme: "success" | "danger" | "primary" | "warning";
}) => {
  
  // Mapping the semantic theme to border highlights
  const themes: Record<string, string> = {
    success: "hover:border-success/50 border-border/40",
    danger: "hover:border-danger/50 border-border/40",
    primary: "hover:border-primary/50 border-border/40",
    warning: "hover:border-warning/50 border-border/40"
  };

  const baseCard =
    "group flex justify-between items-center p-4 rounded-xl border shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]";

  return (
    // Background: bg-white -> bg-card
    <div className={`${baseCard} bg-card ${themes[theme]} transition-colors duration-300`}>
      
      <div className="flex flex-col gap-1">
        {/* Name: text-zinc-800 -> text-text */}
        <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">
          {head.name}
        </p>

        {/* Description: text-zinc-500 -> text-text-muted */}
        {head.description && (
          <p className="text-[10px] text-text-muted italic leading-tight opacity-80">
            {head.description}
          </p>
        )}
      </div>

      {/* GL CODE BADGE: bg-zinc-100 -> bg-shaded */}
      <span className="
        text-[9px] font-black font-mono px-2.5 py-1 rounded-lg
        bg-shaded text-text-muted
        border border-border/50
        group-hover:border-primary/30 group-hover:text-text
        transition-all
      ">
        {head.code}
      </span>
    </div>
  );
};