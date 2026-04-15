import React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

const getBadgeColor = (type?: string) => {
  switch (type) {
    case "FULL_TIME":
      return "bg-emerald-100 text-emerald-700";
    case "PART_TIME":
      return "bg-blue-100 text-blue-700";
    case "CONTRACT":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-zinc-100 text-zinc-600";
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

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-zinc-200">

      {/* BACK */}
      <Link href="/staff">
        <Button variant="ghost" className="px-3 border border-zinc-300">
          ← Back
        </Button>
      </Link>

      {/* EDIT */}
      <Link href={`/staff/${staffId}/edit`}>
        <Button variant="secondary" className="px-4 border border-zinc-300">
          Edit Info
        </Button>
      </Link>

      {/* AVATAR */}
      {staff?.profileImageUrl ? (
        <img
          src={staff.profileImageUrl}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover border border-zinc-200 shadow-sm ml-2"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-300 ml-2 flex items-center justify-center text-zinc-600 font-black text-lg">
          {nameInitial}
        </div>
      )}

      {/* INFO */}
      <div className="flex flex-col ml-2 min-w-0">
        <h1 className="text-2xl font-black text-zinc-900 leading-tight truncate">
          {staff?.fullName || "Unnamed Staff"}{" "}
          {staff?.nepaliName && (
            <span className="text-lg text-zinc-500 font-normal">
              ({staff.nepaliName})
            </span>
          )}
        </h1>

        <p className="text-sm font-medium text-zinc-500 truncate">
          {staff?.designation || "Staff Member"} •{" "}
          {staff?.department || "General Department"}
        </p>
      </div>

      {/* STATUS BADGE */}
      <span
        className={`ml-auto px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getBadgeColor(
          staff?.employmentType
        )}`}
      >
        {(staff?.employmentType || "ACTIVE").replace("_", " ")}
      </span>
    </div>
  );
};