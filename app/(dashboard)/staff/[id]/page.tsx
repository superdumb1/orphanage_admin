import React from "react";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { notFound } from "next/navigation";
import { StaffProfileHeader } from "@/components/organisms/staffs/staffpage/StaffProfileHeader";
import { BasicInfoCard, ComplianceCard, BankCard } from "@/components/organisms/staffs/staffpage/StaffProfileCards";
import { SalaryCard } from "@/components/organisms/staffs/staffpage/StaffSalaryCard";

export default async function StaffProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  const cleanId = id.trim();
  
  const rawStaff = await Staff.findById(cleanId).lean();

  if (!rawStaff) return notFound();

  const staff = JSON.parse(JSON.stringify(rawStaff));

  const s = staff.salary || {};
  const a = s.allowances || {};
  const grossSalary =
    (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
    (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
    (a.food || 0) + (a.communication || 0) + (a.other || 0);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20 pt-4 transition-colors duration-500">
      
      {/* Now passing a "Plain" object that won't crash the Client Components */}
      <StaffProfileHeader 
        staff={staff} 
        staffId={cleanId} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <BasicInfoCard staff={staff} />
        
        <ComplianceCard staff={staff} />

        <div className="md:col-span-1">
            <SalaryCard 
                staff={staff} 
                grossSalary={grossSalary} 
            />
        </div>

        <BankCard staff={staff} />
        
      </div>

      <div className="px-2">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">
            System Record ID: {cleanId} • Subject to Kree Corp Audit Protocols
          </p>
      </div>
    </div>
  );
}