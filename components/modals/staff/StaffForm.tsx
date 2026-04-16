"use client";
import React, { useActionState, useEffect, useState } from "react";
import { createStaff, updateStaff } from "@/app/actions/staff";
import { StaffFormInputs } from "@/types/StaffFormInputs";
import { Button } from "@/components/atoms/Button";
import { ChevronDown, ChevronRight, Save, Info, Wallet, Landmark, ShieldCheck, Briefcase, Activity } from "lucide-react";
import BasicInfoFields from "@/components/organisms/staffs/staffFormAccecerios/BasicInfoFeilds";
import { EmploymentDetails } from "@/components/organisms/staffs/staffFormAccecerios/EmployMentDetails";
import SalaryDropdownForm from "@/components/organisms/staffs/staffFormAccecerios/SalaryDropdownForm";
import SSFPFcontri from "@/components/organisms/staffs/staffFormAccecerios/SSFPFcontri";
import BankDetails from "@/components/organisms/staffs/staffFormAccecerios/BankDetails";

export const StaffForm = ({ initialData,closeModal }: { initialData?: StaffFormInputs,closeModal:()=>void }) => {
  const [activeSection, setActiveSection] = useState("basic");
  const baseAction = initialData ? updateStaff : createStaff;
  const [state, formAction, isPending] = useActionState(baseAction, {
    success: false,
    error: null,
  });

  const [liveSalary] = useState(() => {
    if (!initialData || !initialData.salary) return { gross: 0, deduction: 0, net: 0 };
    console.log(initialData)
    const s = initialData.salary;
    const a = s.allowances || {};
    const basic = s.basicSalary || 0;
    const grade = s.grade || 0;
    const da = s.dearnessAllowance || 0;
    const allowances = Object.values(a).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const ssfPercent = initialData.ssf?.employeeContribution || 0;
    const insurance = s.insurancePremium || 0;
    const gross = basic + grade + da + allowances;
    const ssfDeduction = (basic + grade + da) * (ssfPercent / 100);
    return { gross, deduction: ssfDeduction + insurance, net: gross - (ssfDeduction + insurance) };
  });

  useEffect(() => {
  
  //if success close modal
  }, [])
  

  const SectionHeader = ({ title, id, label, icon: Icon }: { title: string, id: string, label: string, icon: any }) => (
    <button
      type="button"
      onClick={() => setActiveSection(activeSection === id ? "" : id)}
      className={`w-full text-left px-6 py-5 border-b border-border/40 flex justify-between items-center transition-all duration-300 group ${activeSection === id ? 'bg-primary/5' : 'hover:bg-white/5'
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg transition-colors ${activeSection === id ? 'bg-primary text-text-invert shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-shaded text-text-muted group-hover:text-text'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className={`font-mono text-[11px] font-black tracking-[0.15em] uppercase ${activeSection === id ? 'text-primary' : 'text-text'}`}>
            {title}
          </span>
          <span className="text-[10px] text-text-muted/60 font-medium">
            {label}
          </span>
        </div>
      </div>
      <div className={`transition-transform duration-300 ${activeSection === id ? 'rotate-90 text-primary' : 'text-text-muted/40'}`}>
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );

  const handleFormError = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    const fieldName = target.name;
    if (!fieldName) return;
    const routes: Record<string, string> = { bank: "bank_details", ssf: "ssf_pf", department: "job", basicSalary: "salary" };
    const matched = Object.keys(routes).find(key => fieldName.startsWith(key));
    setActiveSection(matched ? routes[matched] : "basic");
  };

  return (
    <form
      action={formAction}
      onInvalid={handleFormError}
      className="text-text relative flex flex-col h-full overflow-hidden"
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto space-y-1 pb-32 custom-scrollbar">
        <SectionHeader title="Identity Core" id="basic" label="PERSONNEL_ID_RECORDS" icon={Info} />
        <div className={activeSection === "basic" ? "px-6 py-8 animate-in fade-in slide-in-from-top-2 duration-300" : "hidden"}><BasicInfoFields initialData={initialData} /></div>

        <SectionHeader title="Deployment Specs" id="job" label="ASSIGNMENT_PARAMETERS" icon={Briefcase} />
        <div className={activeSection === "job" ? "px-6 py-8 animate-in fade-in slide-in-from-top-2 duration-300" : "hidden"}><EmploymentDetails initialData={initialData} /></div>

        <SectionHeader title="Credit Structure" id="salary" label="COMPENSATION_ALGORITHM" icon={Wallet} />
        <div className={activeSection === "salary" ? "px-6 py-8 animate-in fade-in slide-in-from-top-2 duration-300" : "hidden"}><SalaryDropdownForm initialData={initialData} /></div>

        <SectionHeader title="Social Protocol" id="ssf_pf" label="BENEFIT_CONTRIBUTIONS" icon={ShieldCheck} />
        <div className={activeSection === "ssf_pf" ? "px-6 py-8 animate-in fade-in slide-in-from-top-2 duration-300" : "hidden"}><SSFPFcontri initialData={initialData} /></div>

        <SectionHeader title="Financial Node" id="bank_details" label="DISBURSEMENT_ENDPOINT" icon={Landmark} />
        <div className={activeSection === "bank_details" ? "px-6 py-8 animate-in fade-in slide-in-from-top-2 duration-300" : "hidden"}><BankDetails initialData={initialData} /></div>
      </div>

      {/* SYSTEM STATUS BAR - FIXED BOTTOM */}
      <div className="mt-auto glass border-t border-primary/20 p-5 flex justify-between items-center backdrop-blur-xl bg-black/40">
        <div className="flex gap-8 items-center">
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-primary/5">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
          </div>

          <div className="flex gap-6 font-mono">
            <div>
              <p className="text-[9px] text-text-muted uppercase tracking-widest mb-1 opacity-50">GROSS_EST</p>
              <p className="text-sm font-black text-text">Rs.{liveSalary.gross.toLocaleString()}</p>
            </div>
            <div className="px-6 border-x border-white/10">
              <p className="text-[9px] text-danger/80 uppercase tracking-widest mb-1">Deductions</p>
              <p className="text-sm font-black text-danger">-{liveSalary.deduction.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[9px] text-success uppercase tracking-widest mb-1 font-bold">NET_PAY</p>
              <p className="text-lg font-black text-success shadow-success/20 drop-shadow-sm">Rs.{liveSalary.net.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 px-8 !text-primary rounded-none border border-primary/50 bg-primary/10 hover:bg-primary hover:!text-white transition-all duration-500 group relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)]"
      >
        <div className="relative z-10 flex items-center gap-3 font-mono text-[11px] font-black tracking-[0.2em]">
          {isPending ? (
            <span className="animate-pulse">EXECUTING...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {initialData ? "COMMIT_CHANGES" : "INITIALIZE_RECORDS"}
            </>
          )}
        </div>
        {/* Subtle button scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>
    </form>
  );
};