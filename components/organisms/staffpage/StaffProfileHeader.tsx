import React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export const StaffProfileHeader = ({ staff, staffId }: { staff: any; staffId: string }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
      <Link href="/staff"><Button variant="ghost" className="px-2 border border-zinc-300">← Back</Button></Link>
      <Link href={`/staff/${staffId}/edit`}><Button variant="secondary" className="px-3 border border-zinc-300">Edit Info</Button></Link>

      {staff.profileImageUrl ? (
        <img src={staff.profileImageUrl} alt="Profile" className="w-14 h-14 rounded-full object-cover border border-zinc-200 ml-4 shadow-sm" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-zinc-200 border border-zinc-300 ml-4 flex items-center justify-center text-zinc-500 font-bold shadow-sm text-xl">
          {staff.fullName[0]}
        </div>
      )}

      <div className="flex flex-col ml-2">
        <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
          {staff.fullName} {staff.nepaliName && <span className="text-lg text-zinc-500 font-normal">({staff.nepaliName})</span>}
        </h1>
        <p className="text-sm font-medium text-red-600">{staff.designation || 'Staff Member'} • {staff.department || 'General'}</p>
      </div>

      <span className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        {staff.employmentType?.replace("_", " ") || 'ACTIVE'}
      </span>
    </div>
  );
};