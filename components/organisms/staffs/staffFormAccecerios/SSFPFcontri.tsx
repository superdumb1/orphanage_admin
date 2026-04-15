"use client";

import React, { useEffect, useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { StaffFormInputs } from "@/types/StaffFormInputs";

const SSFPFcontri = ({ initialData }: { initialData?: StaffFormInputs }) => {
  const [type, setType] = useState(initialData?.ssf?.type || "NONE");

  const isSSF = type === "SSF";
  const isNone = type === "NONE";

  const [empContri, setEmpContri] = useState<number>(
    initialData?.ssf?.employeeContribution ?? 0
  );

  const [emprContri, setEmprContri] = useState<number>(
    initialData?.ssf?.employerContribution ?? 0
  );

  useEffect(() => {
    if (type === "SSF") {
      setEmpContri(11);
      setEmprContri(20);
    }

    if (type === "NONE") {
      setEmpContri(0);
      setEmprContri(0);
    }
  }, [type]);

  return (
    <div className="p-6 flex flex-col gap-6 bg-white rounded-2xl border border-zinc-200">

      {/* TOP SELECT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Retirement Scheme (अवकाश योजना)"
          name="ssf.type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "SSF", label: "SSF" },
            { value: "PF_CIT", label: "EPF + CIT" },
            { value: "NONE", label: "None" },
          ]}
        />

        <FormField
          label="Identity Number (SSF/EPF No.)"
          name="ssf.idNumber"
          disabled={isNone}
          required={!isNone}
          pattern={isSSF ? "[0-9]{11}" : undefined}
          defaultValue={initialData?.ssf?.idNumber}
        />
      </div>

      {/* CONTRIBUTIONS (THEMED FIELDS) */}
      <div className="grid grid-cols-2 gap-6">
        <FormField
          label="Employee Contribution (%)"
          name="ssf.employeeContribution"
          type="number"
          value={empContri}
          onChange={(e: any) => setEmpContri(Number(e.target.value))}
          disabled={isNone}
          readOnly={isSSF}
        />

        <FormField
          label="Employer Contribution (%)"
          name="ssf.employerContribution"
          type="number"
          value={emprContri}
          onChange={(e: any) => setEmprContri(Number(e.target.value))}
          disabled={isNone}
          readOnly={isSSF}
        />
      </div>

    </div>
  );
};

export default SSFPFcontri;