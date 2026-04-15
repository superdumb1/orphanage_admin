"use client";

import React from "react";

export const SalaryCard = ({ staff, grossSalary }: { staff: any; grossSalary: number }) => {
  const s = staff.salary || {};
  const ssf = staff.ssf || {};

  const baseForSSF =
    (s.basicSalary || 0) +
    (s.grade || 0) +
    (s.dearnessAllowance || 0);

  const employeeSsfPercent = Number(ssf.employeeContribution) || 0;

  const ssfDeduction = (baseForSSF * employeeSsfPercent) / 100;
  const insuranceDeduction = Number(s.insurancePremium) || 0;

  const totalDeductions = ssfDeduction + insuranceDeduction;
  const netSalary = grossSalary - totalDeductions;

  const money = (v: number) => `Rs. ${v.toLocaleString()}`;

  return (
    // Updated: bg-white -> bg-card, border-zinc-200 -> border-border
    <div className="bg-card p-6 rounded-dashboard shadow-glow border border-border flex flex-col gap-5 transition-colors duration-500">

      {/* HEADER */}
      <h2 className="text-lg font-black text-text border-b border-border pb-3">
        Salary & Payslip Overview
      </h2>

      {/* GROSS: Updated bg-zinc-50 -> bg-shaded */}
      <div className="flex justify-between items-center bg-shaded p-4 rounded-xl border border-border">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">
          Gross Salary
        </span>
        <span className="text-lg font-black text-text">
          {money(grossSalary)}
        </span>
      </div>

      {/* EARNINGS */}
      <div className="space-y-2 text-sm text-text-muted">
        <div className="flex justify-between">
          <span>Basic Salary</span>
          <strong className="text-text">{money(s.basicSalary || 0)}</strong>
        </div>

        <div className="flex justify-between">
          <span>Grade + DA</span>
          <strong className="text-text">
            {money((s.grade || 0) + (s.dearnessAllowance || 0))}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Allowances</span>
          <strong className="text-text">
            {money(grossSalary - baseForSSF)}
          </strong>
        </div>
      </div>

      {/* DEDUCTIONS */}
      <div className="border-t border-border pt-3 space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-text-muted/60">
          Deductions
        </p>

        <div className="flex justify-between text-sm text-text-muted">
          <span>SSF ({employeeSsfPercent}%)</span>
          {/* Updated text-rose-600 -> text-danger */}
          <strong className="text-danger">- {money(ssfDeduction)}</strong>
        </div>

        <div className="flex justify-between text-sm text-text-muted">
          <span>Insurance</span>
          <strong className="text-danger">- {money(insuranceDeduction)}</strong>
        </div>
      </div>

      {/* NET: Updated bg-emerald-50 -> bg-success/10, text-emerald -> text-success */}
      <div className="bg-success/10 border border-success/20 p-4 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-xs font-black text-success uppercase tracking-widest">
            Net Salary
          </p>
          <p className="text-[11px] text-success/80">
            Final take-home amount
          </p>
        </div>

        <span className="text-2xl font-black text-success">
          {money(netSalary)}
        </span>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between text-[11px] text-text-muted/50 border-t border-border pt-3">
        <span>Bonus: {s.festivalBonusMonths || 0} month(s)</span>
        <span>Employer SSF: {ssf.employerContribution || 0}%</span>
      </div>
    </div>
  );
};