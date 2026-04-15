import React from "react";

export const BasicInfoCard = ({ staff }: { staff: any }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-4">
    <h2 className="text-lg font-bold text-zinc-900 border-b pb-2">Basic Information</h2>
    <div className="space-y-3 text-sm text-zinc-600">
      <p><strong className="text-zinc-900 w-32 inline-block">Phone:</strong> {staff.phone}</p>
      <p><strong className="text-zinc-900 w-32 inline-block">Email:</strong> {staff.email}</p>
      <p><strong className="text-zinc-900 w-32 inline-block">Address:</strong> {staff.address || 'N/A'}</p>
      <p><strong className="text-zinc-900 w-32 inline-block">Gender:</strong> {staff.gender || 'N/A'}</p>
      <p><strong className="text-zinc-900 w-32 inline-block">Marital Status:</strong> {staff.maritalStatus || 'N/A'}</p>
      <p><strong className="text-zinc-900 w-32 inline-block">Join Date:</strong> {staff.joinDate ? new Date(staff.joinDate).toLocaleDateString() : 'N/A'}</p>
    </div>
  </div>
);

export const ComplianceCard = ({ staff }: { staff: any }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-4">
    <h2 className="text-lg font-bold text-zinc-900 border-b pb-2">Identity & Compliance</h2>
    <div className="space-y-3 text-sm text-zinc-600">
      <p><strong className="text-zinc-900 w-32 inline-block">Citizenship No:</strong> {staff.citizenshipNo || 'N/A'}</p>
      <p><strong className="text-zinc-900 w-32 inline-block">PAN Number:</strong> {staff.panNumber || 'N/A'}</p>
      <p><strong className="text-zinc-900 w-32 inline-block">Subject to TDS:</strong> 
        <span className={staff.applyTDS ? "text-red-600 font-bold" : "text-zinc-500"}>{staff.applyTDS ? "Yes (Taxable)" : "No"}</span>
      </p>
      
      <div className="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="font-bold text-zinc-900 mb-1">Retirement Scheme ({staff.ssf?.type || 'NONE'})</p>
          <p>ID Number: <span className="font-mono">{staff.ssf?.idNumber || 'N/A'}</span></p>
          {staff.ssf?.type !== 'NONE' && (
            <p className="mt-1 text-xs text-zinc-500">Employee: {staff.ssf?.employeeContribution}% | Employer: {staff.ssf?.employerContribution}%</p>
          )}
      </div>
    </div>
  </div>
);

export const BankCard = ({ staff }: { staff: any }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-4">
    <h2 className="text-lg font-bold text-zinc-900 border-b pb-2">Bank Details</h2>
    {staff.bank?.accountNumber ? (
      <div className="space-y-3 text-sm text-zinc-600">
          <p><strong className="text-zinc-900 w-32 inline-block">Bank Name:</strong> {staff.bank.bankName || 'N/A'}</p>
          <p><strong className="text-zinc-900 w-32 inline-block">Branch:</strong> {staff.bank.branch || 'N/A'}</p>
          <p><strong className="text-zinc-900 w-32 inline-block">Account Name:</strong> {staff.bank.accountName || 'N/A'}</p>
          <div className="mt-2 p-3 bg-zinc-900 text-zinc-100 rounded-lg font-mono text-lg text-center tracking-widest shadow-inner">
              {staff.bank.accountNumber}
          </div>
      </div>
    ) : (
       <p className="text-sm text-zinc-400 italic">No banking information recorded.</p>
    )}
  </div>
);