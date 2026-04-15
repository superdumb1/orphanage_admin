import React from "react";

type Staff = any;

// reusable row (IMPORTANT: keeps your UI consistent everywhere)
const Row = ({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  highlight?: boolean;
}) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-zinc-500 font-medium w-40">{label}</span>
    <span
      className={`font-medium ${
        highlight ? "text-zinc-900 font-bold" : "text-zinc-700"
      } ${mono ? "font-mono tracking-wide" : ""}`}
    >
      {value ?? "N/A"}
    </span>
  </div>
);

export const BasicInfoCard = ({ staff }: { staff: Staff }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-5">
    <h2 className="text-lg font-black text-zinc-900 border-b pb-3">
      Basic Information
    </h2>

    <div className="flex flex-col gap-3">
      <Row label="Phone" value={staff?.phone} highlight />
      <Row label="Email" value={staff?.email} />
      <Row label="Address" value={staff?.address} />
      <Row label="Gender" value={staff?.gender} />
      <Row label="Marital Status" value={staff?.maritalStatus} />
      <Row
        label="Join Date"
        value={
          staff?.joinDate
            ? new Date(staff.joinDate).toLocaleDateString()
            : "N/A"
        }
      />
    </div>
  </div>
);


export const ComplianceCard = ({ staff }: { staff: Staff }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-5">
    <h2 className="text-lg font-black text-zinc-900 border-b pb-3">
      Identity & Compliance
    </h2>

    <div className="flex flex-col gap-3">
      <Row label="Citizenship No" value={staff?.citizenshipNo} />
      <Row label="PAN Number" value={staff?.panNumber} />
      <Row
        label="TDS Status"
        value={staff?.applyTDS ? "Yes (Taxable)" : "No"}
        highlight={staff?.applyTDS}
      />

      {/* SSF BLOCK */}
      <div className="mt-2 bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col gap-2">
        <p className="font-black text-zinc-900 text-sm">
          Retirement Scheme ({staff?.ssf?.type || "NONE"})
        </p>

        <Row
          label="ID Number"
          value={staff?.ssf?.idNumber}
          mono
        />

        {staff?.ssf?.type !== "NONE" && (
          <Row
            label="Contributions"
            value={
              <>
                <span className="text-emerald-700 font-bold">
                  {staff?.ssf?.employeeContribution}%
                </span>{" "}
                /{" "}
                <span className="text-blue-700 font-bold">
                  {staff?.ssf?.employerContribution}%
                </span>
              </>
            }
          />
        )}
      </div>
    </div>
  </div>
);


export const BankCard = ({ staff }: { staff: Staff }) => {
  const bank = staff?.bank;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-5">
      <h2 className="text-lg font-black text-zinc-900 border-b pb-3">
        Bank Details
      </h2>

      {bank?.accountNumber ? (
        <div className="flex flex-col gap-3">
          <Row label="Bank Name" value={bank.bankName} />
          <Row label="Branch" value={bank.branch} />
          <Row label="Account Name" value={bank.accountName} />

          <div className="mt-2 p-4 bg-zinc-900 text-white rounded-xl text-center font-mono tracking-widest text-lg">
            {bank.accountNumber}
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-400 italic">
          No banking information recorded.
        </p>
      )}
    </div>
  );
};