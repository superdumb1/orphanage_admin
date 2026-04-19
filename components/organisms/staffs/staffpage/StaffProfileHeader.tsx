"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { useUIModals } from "@/hooks/useUIModal";

// Updated to use semantic theme tokens
const getBadgeColor = (type?: string) => {
  switch (type) {
    case "FULL_TIME":
      return "bg-success/10 text-success border-success/20";
    case "PART_TIME":
      return "bg-primary/10 text-primary border-primary/20";
    case "CONTRACT":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-shaded text-text-muted border-border";
  }
};

export const StaffProfileHeader = ({
  staff,
  staffId,
}: {
  staff: any;
  staffId: string;
}) => {
  const nameInitial = staff?.fullName?.charAt(0)?.toUpperCase() || "?";
  const { openStaffForm } = useUIModals()

  return (
    // Container: Updated bg-white -> bg-card, border-zinc-200 -> border-border
    <div className="flex flex-wrap items-center gap-4 bg-card p-6 rounded-dashboard shadow-glow border border-border transition-colors duration-500">

      {/* BACK BUTTON: Use ghost variant but themed border */}
      <Link href="/staff">
        <Button variant="ghost" className="px-4 border border-border hover:bg-shaded">
          ← Back
        </Button>
      </Link>

      {/* EDIT BUTTON */}
      <Button onClick={()=>openStaffForm({ staff: staff })} variant="secondary" className="px-5 border border-border hover:bg-shaded text-text">
        Edit Info
      </Button>

      {/* AVATAR: Updated border and fallback colors */}
      {staff?.profileImageUrl ? (
        <img
          src={staff.profileImageUrl}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-2 border-border shadow-sm ml-2"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-shaded border border-border ml-2 flex items-center justify-center text-text-muted font-black text-xl">
          {nameInitial}
        </div>
      )}

      {/* INFO: Updated text colors */}
      <div className="flex flex-col ml-2 min-w-0">
        <h1 className="text-2xl font-black text-text leading-tight truncate">
          {staff?.fullName || "Unnamed Staff"}{" "}
          {staff?.nepaliName && (
            <span className="text-lg text-text-muted font-normal italic">
              ({staff.nepaliName})
            </span>
          )}
        </h1>

        <p className="text-sm font-medium text-text-muted truncate">
          {staff?.designation || "Staff Member"} •{" "}
          {staff?.department || "General Department"}
        </p>
      </div>

      {/* STATUS BADGE: Dynamic colors based on theme tokens */}
      <span
        className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${getBadgeColor(
          staff?.employmentType
        )}`}
      >
        {(staff?.employmentType || "ACTIVE").replace("_", " ")}
      </span>
    </div>
  );
};