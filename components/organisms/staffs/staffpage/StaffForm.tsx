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
    // Updated bg-white to bg-card
    <div className="p-6 flex flex-col gap-6 bg-card transition-colors duration-500">
      
      {/* HEADER: Updated text and border colors */}
      <div className="border-b border-border pb-2">
        <h2 className="text-sm font-bold text-text uppercase tracking-widest">
          Retirement Scheme
        </h2>
        <p className="text-xs text-text-muted">
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
          // Replaced zinc focus rings with primary theme color
          className="border-border focus:ring-primary"
          defaultValue={initialData?.ssf?.idNumber}
        />
      </div>

      {/* CONTRIBUTIONS */}
      <div className="grid grid-cols-2 gap-4">
        {/* Container: bg-zinc-50 -> bg-shaded */}
        <div className="p-4 border border-border rounded-xl bg-shaded">
          <p className="text-xs font-bold text-text-muted uppercase">Employee %</p>
          <input
            // Input: bg-white -> bg-bg, text-zinc -> text-text
            className="w-full mt-2 bg-bg border border-border rounded-lg px-3 py-2 text-sm font-bold text-text focus:outline-none focus:border-primary disabled:opacity-50 transition-all"
            value={empContri}
            readOnly={type === "SSF"}
            disabled={type === "NONE"}
            onChange={(e) => setEmpContri(e.target.value)}
          />
        </div>

        <div className="p-4 border border-border rounded-xl bg-shaded">
          <p className="text-xs font-bold text-text-muted uppercase">Employer %</p>
          <input
            className="w-full mt-2 bg-bg border border-border rounded-lg px-3 py-2 text-sm font-bold text-text focus:outline-none focus:border-primary disabled:opacity-50 transition-all"
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