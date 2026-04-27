"use client";
import React, { useActionState, useEffect, useState } from "react";
import { createStaff, updateStaff } from "@/app/actions/staff";
import { StaffFormInputs } from "@/types/StaffFormInputs";
import { Button } from "@/components/atoms/Button";
import {
  Eye, EyeOff,
  ChevronRight, Info, Wallet, Landmark,
  ShieldCheck, Briefcase, KeyRound, UserPlus, XCircle
} from "lucide-react";
import BasicInfoFields from "@/components/organisms/staffs/staffFormAccecerios/BasicInfoFeilds";
import { EmploymentDetails } from "@/components/organisms/staffs/staffFormAccecerios/EmployMentDetails";
import SalaryDropdownForm from "@/components/organisms/staffs/staffFormAccecerios/SalaryDropdownForm";
import SSFPFcontri from "@/components/organisms/staffs/staffFormAccecerios/SSFPFcontri";
import BankDetails from "@/components/organisms/staffs/staffFormAccecerios/BankDetails";

export const StaffForm = ({
  initialData,
  closeModal,
}: {
  initialData?: StaffFormInputs,
  closeModal: () => void,
}) => {
  const [activeSection, setActiveSection] = useState("basic");
  const [selectedUserId, setSelectedUserId] = useState("");

  // ✨ Password Validation State
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const isPasswordMismatch = passwords.password !== passwords.confirm && passwords.confirm !== "";
  const isPasswordEmpty = !initialData && !selectedUserId && !passwords.password;

  const baseAction = initialData ? updateStaff : createStaff;
  const [state, formAction, isPending] = useActionState(baseAction, {
    success: false,
    error: null,
  });

  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (state?.success) closeModal();
  }, [state?.success, closeModal]);

  const SectionHeader = ({ title, id, label, icon: Icon }: any) => (
    <button
      type="button"
      onClick={() => setActiveSection(activeSection === id ? "" : id)}
      className={`w-full text-left px-6 py-5 border-b border-border/40 flex justify-between items-center transition-all duration-300 group ${activeSection === id ? 'bg-primary/5' : 'hover:bg-white/5'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg transition-colors ${activeSection === id ? 'bg-primary text-text-invert shadow-glow' : 'bg-shaded text-text-muted group-hover:text-text'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className={`font-mono text-[11px] font-black tracking-[0.15em] uppercase ${activeSection === id ? 'text-primary' : 'text-text'}`}>{title}</span>
          <span className="text-[10px] text-text-muted/60 font-medium">{label}</span>
        </div>
      </div>
      <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === id ? 'rotate-90 text-primary' : 'text-text-muted/40'}`} />
    </button>
  );

  return (
    <form action={formAction} className="text-text relative flex flex-col h-full overflow-hidden bg-bg">

      {/* ERROR FEEDBACK */}
      {(state?.error || isPasswordMismatch) && (
        <div className="m-4 p-4 bg-danger/10 border border-danger/20 rounded-xl animate-in shake-200">
          <p className="text-[10px] font-black text-danger uppercase tracking-widest flex items-center gap-2">
            <XCircle size={14} />
            {isPasswordMismatch ? "Security Alert: Passwords do not match" : `Protocol Error: ${state.error}`}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-1 pb-32 custom-scrollbar">

        {/* SECTION: BASIC INFO */}
        <SectionHeader title="Identity Core" id="basic" label="PERSONNEL_ID_RECORDS" icon={Info} />
        <div className={activeSection === "basic" ? "px-6 py-8 block animate-in fade-in slide-in-from-top-1" : "hidden"}>
          <BasicInfoFields initialData={initialData} />
        </div>

        {/* SECTION: ACCESS CREDENTIALS */}
        {!initialData && !selectedUserId && (
          <>
            <SectionHeader title="Access Credentials" id="access" label="SYSTEM_AUTH_PROVISIONING" icon={KeyRound} />
            <div className={activeSection === "access" ? "px-6 py-8 block animate-in fade-in" : "hidden"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-shaded p-6 rounded-2xl border border-border">

                {/* USERNAME */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Login Username</label>
                  <input
                    name="username"
                    autoComplete="off"
                    placeholder="e.g. biswa_admin"
                    required={!selectedUserId}
                    className="bg-bg border border-border p-3 rounded-xl text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">System Password</label>
                  <div className="relative group">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={passwords.password}
                      onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                      required={!selectedUserId}
                      className={`w-full bg-bg border p-3 pr-10 rounded-xl text-sm focus:ring-1 outline-none font-mono ${isPasswordMismatch ? 'border-danger/50 focus:ring-danger' : 'border-border focus:ring-primary'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Confirm Password</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      required={!selectedUserId}
                      className={`w-full bg-bg border p-3 pr-10 rounded-xl text-sm focus:ring-1 outline-none font-mono ${isPasswordMismatch ? 'border-danger/50 focus:ring-danger' : 'border-border focus:ring-primary'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
                <ShieldCheck size={12} className={isPasswordMismatch ? "text-danger" : "text-primary"} />
                <p className={`text-[9px] uppercase font-black tracking-tighter ${isPasswordMismatch ? "text-danger" : "text-text-muted"}`}>
                  {isPasswordMismatch ? "Validation Failed: Password mismatch detected." : "Security: Admin-defined credentials override guest registrations."}
                </p>
              </div>
            </div>
          </>
        )}

        {/* OTHER SECTIONS */}
        <SectionHeader title="Deployment Specs" id="job" label="ASSIGNMENT_PARAMETERS" icon={Briefcase} />
        <div className={activeSection === "job" ? "px-6 py-8 block" : "hidden"}>
          <EmploymentDetails initialData={initialData} />
        </div>

        <SectionHeader title="Credit Structure" id="salary" label="COMPENSATION_ALGORITHM" icon={Wallet} />
        <div className={activeSection === "salary" ? "px-6 py-8 block" : "hidden"}>
          <SalaryDropdownForm initialData={initialData} />
        </div>

        <SectionHeader title="Social Protocol" id="ssf_pf" label="BENEFIT_CONTRIBUTIONS" icon={ShieldCheck} />
        <div className={activeSection === "ssf_pf" ? "px-6 py-8 block" : "hidden"}>
          <SSFPFcontri initialData={initialData} />
        </div>

        <SectionHeader title="Financial Node" id="bank_details" label="DISBURSEMENT_ENDPOINT" icon={Landmark} />
        <div className={activeSection === "bank_details" ? "px-6 py-8 block" : "hidden"}>
          <BankDetails initialData={initialData} />
        </div>
      </div>

      {/* HIDDEN LOGIC INPUTS */}
      <input type="hidden" name="_id" value={initialData?._id || ""} />
      <input type="hidden" name="userId" value={selectedUserId} />

      {/* STICKY FOOTER */}
      <div className="mt-auto border-t border-border p-6 bg-card flex justify-end items-center backdrop-blur-md">
        <Button
          type="submit"
          disabled={isPending || isPasswordMismatch || (isPasswordEmpty && !selectedUserId)}
          className="h-12 px-10 font-mono text-xs font-black tracking-[0.2em] uppercase bg-primary text-text-invert shadow-glow-primary active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          {isPending ? "EXECUTING_SYNC..." : initialData ? "UPDATE_PERSONNEL" : "COMMIT_REGISTRY"}
        </Button>
      </div>
    </form>
  );
};