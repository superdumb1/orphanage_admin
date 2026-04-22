"use client";
import React, { useActionState, useEffect, useState } from "react";
import { createStaff, updateStaff } from "@/app/actions/staff";
import { StaffFormInputs } from "@/types/StaffFormInputs";
import { Button } from "@/components/atoms/Button";
import { ChevronRight, Save, Info, Wallet, Landmark, ShieldCheck, Briefcase, Activity, UserSearch } from "lucide-react";
import BasicInfoFields from "@/components/organisms/staffs/staffFormAccecerios/BasicInfoFeilds";
import { EmploymentDetails } from "@/components/organisms/staffs/staffFormAccecerios/EmployMentDetails";
import SalaryDropdownForm from "@/components/organisms/staffs/staffFormAccecerios/SalaryDropdownForm";
import SSFPFcontri from "@/components/organisms/staffs/staffFormAccecerios/SSFPFcontri";
import BankDetails from "@/components/organisms/staffs/staffFormAccecerios/BankDetails";

// ✨ Updated Props to include pendingUsers
export const StaffForm = ({ 
  initialData, 
  closeModal, 
  pendingUsers = [] 
}: { 
  initialData?: StaffFormInputs, 
  closeModal: () => void,
  pendingUsers?: any[] 
}) => {
  const [activeSection, setActiveSection] = useState("basic");
  
  // ✨ Added state to hold the auto-filled data
  const [selectedUserId, setSelectedUserId] = useState("");
  const [importedData, setImportedData] = useState<any>(null);

  const baseAction = initialData ? updateStaff : createStaff;
  const [state, formAction, isPending] = useActionState(baseAction, {
    success: false,
    error: null,
  });

  const handleImport = (userId: string) => {
    const user = pendingUsers.find(u => u._id === userId);
    if (user) {
      setSelectedUserId(userId);
      // This object will be passed to BasicInfoFields
      setImportedData({
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        userId: user._id,
      });
    }
  };

  // Salary logic remains the same...
  const [liveSalary] = useState(() => {
    if (!initialData || !initialData.salary) return { gross: 0, deduction: 0, net: 0 };
    const s = initialData.salary;
    const a = s.allowances || {};
    const gross = (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) + 
                  Object.values(a).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const ssfDeduction = ((s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0)) * ((initialData.ssf?.employeeContribution || 0) / 100);
    const totalDeduction = ssfDeduction + (s.insurancePremium || 0);
    return { gross, deduction: totalDeduction, net: gross - totalDeduction };
  });

  const SectionHeader = ({ title, id, label, icon: Icon }: { title: string, id: string, label: string, icon: any }) => (
    <button
      type="button"
      onClick={() => setActiveSection(activeSection === id ? "" : id)}
      className={`w-full text-left px-6 py-5 border-b border-border/40 flex justify-between items-center transition-all duration-300 group ${activeSection === id ? 'bg-primary/5' : 'hover:bg-white/5'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg transition-colors ${activeSection === id ? 'bg-primary text-text-invert shadow-glow' : 'bg-shaded text-text-muted group-hover:text-text'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className={`font-mono text-[11px] font-black tracking-[0.15em] uppercase ${activeSection === id ? 'text-primary' : 'text-text'}`}>{title}</span>
          <span className="text-[10px] text-text-muted/60 font-medium">{label}</span>
        </div>
      </div>
      <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === id ? 'rotate-90 text-primary' : 'text-text-muted/40'}`} />
    </button>
  );

  return (
    <form action={formAction} className="text-text relative flex flex-col h-full overflow-hidden">
      
      {/* ✨ Stylized Import Dropdown */}
      {!initialData && pendingUsers.length > 0 && (
        <div className="bg-primary/10 border-b border-primary/20 p-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Import Pending Requisition</label>
          <select 
            onChange={(e) => handleImport(e.target.value)}
            className="w-full bg-bg border border-primary/30 rounded-lg p-2 text-xs font-bold text-text outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Personnel to Auto-Fill --</option>
            {pendingUsers.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-1 pb-32 custom-scrollbar">
        <SectionHeader title="Identity Core" id="basic" label="PERSONNEL_ID_RECORDS" icon={Info} />
        <div className={activeSection === "basic" ? "px-6 py-8 block" : "hidden"}>
          {/* ✨ Passing importedData OR initialData to fields */}
          <BasicInfoFields initialData={importedData || initialData} />
        </div>

        <SectionHeader title="Deployment Specs" id="job" label="ASSIGNMENT_PARAMETERS" icon={Briefcase} />
        <div className={activeSection === "job" ? "px-6 py-8 block" : "hidden"}>
          <EmploymentDetails initialData={importedData || initialData} />
        </div>

        <SectionHeader title="Credit Structure" id="salary" label="COMPENSATION_ALGORITHM" icon={Wallet} />
        <div className={activeSection === "salary" ? "px-6 py-8 block" : "hidden"}><SalaryDropdownForm initialData={initialData} /></div>

        <SectionHeader title="Social Protocol" id="ssf_pf" label="BENEFIT_CONTRIBUTIONS" icon={ShieldCheck} />
        <div className={activeSection === "ssf_pf" ? "px-6 py-8 block" : "hidden"}><SSFPFcontri initialData={initialData} /></div>

        <SectionHeader title="Financial Node" id="bank_details" label="DISBURSEMENT_ENDPOINT" icon={Landmark} />
        <div className={activeSection === "bank_details" ? "px-6 py-8 block" : "hidden"}><BankDetails initialData={initialData} /></div>
      </div>

      <input type="hidden" name="userId" value={selectedUserId} />
      
      <div className="mt-auto glass border-t border-primary/20 p-5 flex justify-between items-center backdrop-blur-xl bg-black/40">
        {/* Salary indicators here... */}
        <Button type="submit" disabled={isPending} className="h-12 px-8 !text-primary rounded-none border border-primary/50 bg-primary/10 hover:bg-primary hover:!text-white transition-all duration-500 font-mono text-[21px] font-black shadow-glow">
          {isPending ? "EXECUTING..." : initialData ? "UPDATE_ENTRY" : "FINALIZE_REGISTRY"}
        </Button>
      </div>
    </form>
  );
};