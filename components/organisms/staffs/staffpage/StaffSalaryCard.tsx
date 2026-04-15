export const SalaryCard = ({ staff, grossSalary }: { staff: any, grossSalary: number }) => {
  const s = staff.salary || {};
  const ssf = staff.ssf || {};

  // 1. Calculate the Base for SSF (Basic + Grade + DA)
  const baseForSSF = (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0);
  
  // 2. Calculate Deductions
  const employeeSsfPercent = Number(ssf.employeeContribution) || 0;
  const ssfDeduction = (baseForSSF * employeeSsfPercent) / 100;
  const insuranceDeduction = s.insurancePremium || 0;
  const totalDeductions = ssfDeduction + insuranceDeduction;

  // 3. Calculate Final Take-Home
  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-200 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-emerald-900 border-b border-emerald-100 pb-2">Salary & Payslip Overview</h2>
      
      {/* GROSS SALARY */}
      <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
         <span className="font-bold text-emerald-900 uppercase text-xs tracking-wider">Gross Monthly Salary</span>
         <span className="text-lg font-black text-emerald-700">Rs. {grossSalary.toLocaleString()}</span>
      </div>

      {/* EARNINGS BREAKDOWN */}
      <div className="space-y-2 text-sm text-zinc-600 mt-2 px-1">
        <div className="flex justify-between"><span className="w-32">Basic Salary:</span> <strong>Rs. {(s.basicSalary || 0).toLocaleString()}</strong></div>
        <div className="flex justify-between"><span className="w-32">Grade / DA:</span> <strong>Rs. {( (s.grade || 0) + (s.dearnessAllowance || 0) ).toLocaleString()}</strong></div>
        <div className="flex justify-between"><span className="w-32">Allowances:</span> <strong>Rs. {(grossSalary - baseForSSF).toLocaleString()}</strong></div>
      </div>

      {/* DEDUCTIONS BREAKDOWN */}
      <div className="border-t border-red-100 pt-3 mt-1">
        <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">Deductions</p>
        <div className="space-y-2 text-sm text-red-600/80 px-1">
            <div className="flex justify-between">
                <span>SSF/Retirement ({employeeSsfPercent}%):</span> 
                <strong>- Rs. {ssfDeduction.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
                <span>Insurance Premium:</span> 
                <strong>- Rs. {insuranceDeduction.toLocaleString()}</strong>
            </div>
        </div>
      </div>

      {/* TAKE HOME PAY (NET) */}
      <div className="mt-2 flex justify-between items-center bg-zinc-900 p-4 rounded-xl shadow-inner text-white">
         <div>
            <p className="font-bold text-emerald-400 uppercase text-xs tracking-wider mb-1">Take-Home Pay (Net)</p>
            <p className="text-[10px] text-zinc-400">Actual amount credited to bank</p>
         </div>
         <span className="text-2xl font-black text-emerald-400">Rs. {netSalary.toLocaleString()}</span>
      </div>

      <div className="border-t border-zinc-100 pt-3 mt-1 flex justify-between text-[11px] text-zinc-400 font-medium">
          <span>Festival Bonus: {s.festivalBonusMonths || 0} Month(s)</span>
          <span>Employer SSF Contribution: {ssf.employerContribution || 0}%</span>
      </div>
    </div>
  );
};