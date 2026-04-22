import React from "react";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import Transaction from "@/models/Transaction"; // ✨ Added to calculate their cash balances
import { notFound } from "next/navigation";
import { StaffProfileHeader } from "@/components/organisms/staffs/staffpage/StaffProfileHeader";
import { BasicInfoCard, ComplianceCard, BankCard } from "@/components/organisms/staffs/staffpage/StaffProfileCards";
import { SalaryCard } from "@/components/organisms/staffs/staffpage/StaffSalaryCard";

export default async function StaffProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  const cleanId = id.trim();
  
  // ✨ Added .populate to fetch the linked User account details (name, email, role)
  const rawStaff = await Staff.findById(cleanId).populate("userId", "email role isActive").lean();

  if (!rawStaff) return notFound();

  // ✨ CALCULATE FINANCIAL BALANCES IF THEY HAVE A LINKED ACCOUNT
  let netBalance = 0;
  if (rawStaff.userId) {
      const balanceResult = await Transaction.aggregate([
          { 
              $match: { 
                  createdBy: rawStaff.userId._id, 
                  status: "VERIFIED", 
                  isSettled: false,
                  $or: [
                      { paymentMethod: "CASH", type: "INCOME" },
                      { paymentMethod: "OUT_OF_POCKET", type: "EXPENSE" } 
                  ]
              } 
          },
          { 
              $group: { 
                  _id: null, 
                  netBalance: { 
                      $sum: { 
                          $cond: [{ $eq: ["$paymentMethod", "CASH"] }, "$amount", { $multiply: ["$amount", -1] }] 
                      } 
                  }
              } 
          }
      ]);
      netBalance = balanceResult[0]?.netBalance || 0;
  }

  const staff = JSON.parse(JSON.stringify({
      ...rawStaff,
      currentBalance: netBalance // Pass the calculated balance down to the Client Components
  }));

  const s = staff.salary || {};
  const a = s.allowances || {};
  const grossSalary =
    (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
    (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
    (a.food || 0) + (a.communication || 0) + (a.other || 0);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20 pt-4 transition-colors duration-500">
      
      <StaffProfileHeader staff={staff} staffId={cleanId} />

      {/* ✨ OPTIONAL: Display the Live Balance if they have one */}
      {staff.userId && staff.currentBalance !== 0 && (
         <div className={`p-4 rounded-xl border ${staff.currentBalance < 0 ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-primary/10 border-primary/30 text-primary'}`}>
             <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                 {staff.currentBalance < 0 ? "Amount Owed to Staff (Out of Pocket)" : "Orphanage Cash Held by Staff"}
             </p>
             <p className="text-2xl font-mono font-black">
                 NPR {Math.abs(staff.currentBalance).toLocaleString()}
             </p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BasicInfoCard staff={staff} />
        <ComplianceCard staff={staff} />
        <div className="md:col-span-1">
            <SalaryCard staff={staff} grossSalary={grossSalary} />
        </div>
        <BankCard staff={staff} />
      </div>

      <div className="px-2 flex flex-col gap-1">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">
            System Record ID: {cleanId} • Subject to Kree Corp Audit Protocols
          </p>
          {/* Output Linked Account info for Admin Verification */}
          {staff.userId && (
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-50">
                Linked Identity: {staff.userId.email} ({staff.userId.role})
              </p>
          )}
      </div>
    </div>
  );
}