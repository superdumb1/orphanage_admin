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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-5">

      {/* HEADER */}
      <h2 className="text-lg font-black text-zinc-900 border-b border-zinc-100 pb-3">
        Salary & Payslip Overview
      </h2>

      {/* GROSS */}
      <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-200">
        <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
          Gross Salary
        </span>
        <span className="text-lg font-black text-zinc-900">
          {money(grossSalary)}
        </span>
      </div>

      {/* EARNINGS */}
      <div className="space-y-2 text-sm text-zinc-600">
        <div className="flex justify-between">
          <span>Basic Salary</span>
          <strong className="text-zinc-900">{money(s.basicSalary || 0)}</strong>
        </div>

        <div className="flex justify-between">
          <span>Grade + DA</span>
          <strong className="text-zinc-900">
            {money((s.grade || 0) + (s.dearnessAllowance || 0))}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Allowances</span>
          <strong className="text-zinc-900">
            {money(grossSalary - baseForSSF)}
          </strong>
        </div>
      </div>

      {/* DEDUCTIONS */}
      <div className="border-t border-zinc-100 pt-3 space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
          Deductions
        </p>

        <div className="flex justify-between text-sm text-zinc-600">
          <span>SSF ({employeeSsfPercent}%)</span>
          <strong className="text-rose-600">- {money(ssfDeduction)}</strong>
        </div>

        <div className="flex justify-between text-sm text-zinc-600">
          <span>Insurance</span>
          <strong className="text-rose-600">- {money(insuranceDeduction)}</strong>
        </div>
      </div>

      {/* NET */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">
            Net Salary
          </p>
          <p className="text-[11px] text-emerald-600">
            Final take-home amount
          </p>
        </div>

        <span className="text-2xl font-black text-emerald-700">
          {money(netSalary)}
        </span>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between text-[11px] text-zinc-400 border-t border-zinc-100 pt-3">
        <span>Bonus: {s.festivalBonusMonths || 0} month(s)</span>
        <span>Employer SSF: {ssf.employerContribution || 0}%</span>
      </div>
    </div>
  );
};