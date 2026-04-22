"use client";

import React, { useActionState, useState } from "react";
import { FormField } from "../molecules/FormField";
import { SelectField } from "../molecules/SelectField";
import { Button } from "../atoms/Button";
import { ShieldAlert, UserPlus, CheckCircle, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";

export const Register = () => {
  const [state, formAction, isPending] = useActionState(registerUser as any, { error: null, success: false });
  const [showPassword, setShowPassword] = useState(false);

  // If successfully registered, show the "Awaiting Clearance" screen
  if (state?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 transition-colors duration-500">
        <div className="w-full max-w-md bg-card border border-border rounded-dashboard shadow-glow overflow-hidden text-center p-10">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/20">
            <CheckCircle className="text-success" size={32} />
          </div>
          <h2 className="text-xl font-black text-text uppercase tracking-widest mb-2">Requisition Received</h2>
          <p className="text-sm text-text-muted font-bold mb-8">
            Your access request has been logged. An administrator must verify and approve your clearance level before you can authenticate.
          </p>
          <Link href="/">
            <Button variant="ghost" className="w-full h-12">Return to Gateway</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8 transition-colors duration-500">
      <form
        action={formAction}
        className="w-full max-w-md bg-card border border-border rounded-dashboard shadow-glow overflow-hidden"
      >
        <div className="p-8 border-b border-border text-center bg-shaded/30">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
            <UserPlus className="text-primary" size={24} />
          </div>
          <h2 className="text-xl font-black text-text uppercase tracking-widest">
            Personnel Registry
          </h2>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter mt-1 opacity-60">
            Submit clearance requisition
          </p>
        </div>

        <div className="p-8 flex flex-col gap-6">
          {state?.error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-[10px] font-black p-4 rounded-xl text-center uppercase tracking-widest animate-in shake-1">
              ⚠ {state.error}
            </div>
          )}

          <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-3">
            <ShieldAlert className="text-warning shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] font-black text-warning uppercase tracking-widest leading-relaxed">
              Notice: All new accounts are locked by default and require manual verification by the System Administrator.
            </p>
          </div>

          <div className="space-y-4">
            <FormField label="Full Legal Name" name="name" required placeholder="e.g. John Doe" />
            <FormField label="Work Email" name="email" type="email" required placeholder="name@kree-corp.com" />
            <FormField label="Contact Number" name="phone" type="tel" placeholder="+977..." />

            <SelectField
              label="Requested Clearance Level"
              name="role"
              required
              options={[
                { label: "Samity Member", value: "SAMITY" },
                { label: "Operations Staff", value: "STAFF" },
                { label: "Caregiver", value: "CAREGIVER" },
                { label: "Medical Staff", value: "MEDICAL_STAFF" },
                { label: "Teacher", value: "TEACHER" }
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group/pass col-span-2">
                <FormField
                  label="Create Access Key"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-1.5 p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="col-span-2">
                <FormField
                  label="Confirm Access Key"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 btn-primary shadow-glow mt-2"
          >
            {isPending ? "Transmitting..." : "Submit Requisition"}
          </Button>
        </div>

        <div className="p-4 bg-shaded/20 text-center border-t border-border/50">
          <Link href="/">
            <p className="text-[10px] text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-widest cursor-pointer">
              ← Return to Secure Gateway
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
};