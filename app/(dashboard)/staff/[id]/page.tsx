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
  const staff = await Staff.findById(cleanId).lean() as any;

  if (!staff) return notFound();

  // Dynamically calculate Gross Salary
  const s = staff.salary || {};
  const a = s.allowances || {};
  const grossSalary =
    (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
    (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
    (a.food || 0) + (a.communication || 0) + (a.other || 0);

  return (
    <div className="flex flex-col gap-6 max-w-5xl pb-10">
      <StaffProfileHeader staff={staff} staffId={cleanId} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicInfoCard staff={staff} />
        <ComplianceCard staff={staff} />
        <SalaryCard staff={staff} grossSalary={grossSalary} />
        <BankCard staff={staff} />
      </div>

    </div>
  );
}