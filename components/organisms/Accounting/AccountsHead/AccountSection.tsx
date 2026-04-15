"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { AccountRow } from "./AccountRow";

export const AccountSection = ({
  title,
  heads,
  theme, // Now expects: "success" | "danger" | "primary" | "warning"
  subTypes,
  onAdd
}: any) => {
  
  // Mapping incoming themes to your global CSS variables with opacity washes
  const bgStyles: any = {
    success: "bg-success/5 border-success/20",
    danger: "bg-danger/5 border-danger/20",
    primary: "bg-primary/5 border-primary/20",
    warning: "bg-warning/5 border-warning/20"
  };

  const textStyles: any = {
    success: "text-success",
    danger: "text-danger",
    primary: "text-primary",
    warning: "text-warning"
  };

  return (
    <div
      className={`
        ${bgStyles[theme]}
        p-8 rounded-dashboard
        border h-full
        transition-all duration-500
      `}
    >
      {/* HEADER: Updated to text-text-muted with tracking-[0.2em] */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="
          text-[11px] font-black uppercase tracking-[0.2em]
          text-text-muted opacity-80
        ">
          {title}
        </h2>

        {/* Action Button: Styled as a micro-action that inherits the section theme */}
        <Button
          onClick={onAdd}
          className={`
            h-8 text-[9px] font-black uppercase tracking-widest px-4 
            border border-transparent hover:border-current
            bg-card text-text shadow-sm hover:bg-shaded transition-all
          `}
        >
          + Add Head
        </Button>
      </div>

      {/* CONTENT FLOW */}
      <div className="space-y-10">
        {subTypes.map((sub: string) => {
          const filtered = heads.filter((h: any) =>
            h.subType?.includes(sub)
          );

          if (!filtered.length) return null;

          return (
            <div key={sub} className="space-y-4">
              
              {/* SUB-CATEGORY TITLE: Micro-caps with semantic color */}
              <h3
                className={`
                  text-[10px] font-black uppercase tracking-[0.15em] px-1
                  ${textStyles[theme]}
                `}
              >
                {sub}
              </h3>

              {/* ROWS LIST */}
              <div className="space-y-2.5">
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