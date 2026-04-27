"use client";

import React, { useActionState, useState } from "react";
import {  CalendarDays, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { processMonthlyPayroll } from "@/app/actions/payroll";
import SelectPaymentCategory from "@/components/molecules/selects/SelectPaymentCategory";
import SelectAccountHead from "@/components/molecules/selects/SelectAccontHead";

export const PayrollDashboard = ({ 
  staffList, 

}: { 
  staffList: any[], 

}) => {
const [state, formAction, isPending] = useActionState(processMonthlyPayroll as any, { error: null, success: false, count: 0 });
  // Current Month/Year for default value
  const currentMonthYear = new Date().toISOString().slice(0, 7); 
  
  const totalPayroll = staffList.reduce((sum, staff) => sum + staff.grossSalary, 0);
  const [selectAccountId, setSelectedAccountId]=useState("")

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-success/10 border border-success/30 rounded-[2rem] text-center animate-in zoom-in-95">
        <CheckCircle className="text-success w-16 h-16 mb-4" />
        <h2 className="text-2xl font-black text-text uppercase tracking-widest">Disbursement Complete</h2>
        <p className="text-sm font-bold text-text-muted mt-2">
          Successfully processed payroll for {state.count} personnel. Funds have been logged to the main ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-dashboard border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
            <span className="text-2xl">💸</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-text uppercase tracking-widest">
              Payroll Engine
            </h2>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter mt-1 opacity-70">
              Bulk personnel salary disbursement
            </p>
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="bg-danger/10 border border-danger/20 p-4 rounded-xl flex items-center gap-3 text-danger">
          <ShieldAlert size={20} />
          <span className="text-xs font-black uppercase tracking-widest">{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* EXECUTION FORM */}
        <form action={formAction} className="lg:col-span-1 bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col gap-6 h-fit">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Execution Parameters</h3>
            
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text uppercase tracking-widest">Billing Cycle</label>
                <input 
                    type="month" 
                    name="monthYear" 
                    defaultValue={currentMonthYear}
                    required
                    className="w-full p-3 text-sm border border-border rounded-xl bg-bg text-text focus:ring-1 focus:ring-primary outline-none"
                />
            </div>

            <div className="flex flex-col gap-2">
             <SelectPaymentCategory forceType="BANK"/>
            </div>

            <div className="flex flex-col gap-2">
               <SelectAccountHead selectedAccountId={selectAccountId} setSelectedAccountId={setSelectedAccountId} transactionType="EXPENSE"/>
            </div>

            <div className="mt-4 pt-6 border-t border-border">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Authorized Disbursement</p>
                <p className="text-3xl font-mono font-black text-danger">NPR {totalPayroll.toLocaleString()}</p>
            </div>

            <Button type="submit" disabled={isPending || totalPayroll === 0} className="w-full h-14 btn-primary shadow-glow mt-2 font-black uppercase tracking-widest">
                {isPending ? "AUTHORIZING..." : "EXECUTE PAYROLL"}
            </Button>
        </form>

        {/* ROSTER PREVIEW */}
        <div className="lg:col-span-2 bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Active Roster ({staffList.length})</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-2 flex flex-col gap-3">
                {staffList.map((staff) => (
                    <div key={staff._id} className="flex justify-between items-center p-4 bg-surface rounded-xl border border-border">
                        <div className="flex flex-col">
                            <span className="font-bold text-text">{staff.fullName}</span>
                            <span className="text-[10px] text-text-muted uppercase tracking-widest">{staff.designation || 'Staff'}</span>
                        </div>
                        <div className="text-right">
                            <span className="font-mono font-black text-text">Rs. {staff.grossSalary.toLocaleString()}</span>
                            {staff.ssfEnrolled && <p className="text-[8px] font-black text-accent uppercase tracking-widest mt-1">SSF Applied</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};