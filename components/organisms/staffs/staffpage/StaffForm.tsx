"use client";
import React, { useState, useEffect } from "react";
import { SelectField } from "@/components/molecules/SelectField";
import { FormField } from "@/components/molecules/FormField";
import { StaffFormInputs } from "@/types/StaffFormInputs";

const SSFPFcontri = ({ initialData }: { initialData?: StaffFormInputs }) => {
  const [type, setType] = useState(initialData?.ssf?.type || "NONE");
  const [empContri, setEmpContri] = useState(initialData?.ssf?.employeeContribution ?? "");
  const [emprContri, setEmprContri] = useState(initialData?.ssf?.employerContribution ?? "");

  useEffect(() => {
    if (type === "SSF") {
      setEmpContri(11);
      setEmprContri(20);
    } else if (type === "NONE") {
      setEmpContri(0);
      setEmprContri(0);
    }
  }, [type]);

  return (
    <div className="p-6 flex flex-col gap-6 bg-white">
      
      {/* HEADER */}
      <div className="border-b border-zinc-200 pb-2">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
          Retirement Scheme
        </h2>
        <p className="text-xs text-zinc-500">
          SSF / PF contribution configuration
        </p>
      </div>

      {/* TYPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Scheme Type"
          name="ssf.type"
          value={type}
          onChange={(e: any) => setType(e.target.value)}
          options={[
            { value: "SSF", label: "SSF (Social Security)" },
            { value: "PF_CIT", label: "EPF + CIT" },
            { value: "NONE", label: "None" },
          ]}
        />

        <FormField
          label="ID Number"
          name="ssf.idNumber"
          disabled={type === "NONE"}
          required={type !== "NONE"}
          className="border-zinc-200 focus:ring-zinc-900"
          defaultValue={initialData?.ssf?.idNumber}
        />
      </div>

      {/* CONTRIBUTIONS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
          <p className="text-xs font-bold text-zinc-500 uppercase">Employee %</p>
          <input
            className="w-full mt-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900"
            value={empContri}
            readOnly={type === "SSF"}
            disabled={type === "NONE"}
            onChange={(e) => setEmpContri(e.target.value)}
          />
        </div>

        <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
          <p className="text-xs font-bold text-zinc-500 uppercase">Employer %</p>
          <input
            className="w-full mt-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900"
            value={emprContri}
            readOnly={type === "SSF"}
            disabled={type === "NONE"}
            onChange={(e) => setEmprContri(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SSFPFcontri;