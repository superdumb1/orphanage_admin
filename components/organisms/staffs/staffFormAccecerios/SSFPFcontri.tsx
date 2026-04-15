"use client";
import React, { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { StaffFormInputs } from "@/types/StaffFormInputs";

const SSFPFcontri = ({ initialData }: { initialData?: StaffFormInputs }) => {
  // Initialize state based on the passed data so it displays correctly on load
  const [type, setType] = useState(initialData?.ssf?.type || "NONE");
  const [empContri, setEmpContri] = useState<number | string>(initialData?.ssf?.employeeContribution ?? "");
  const [emprContri, setEmprContri] = useState<number | string>(initialData?.ssf?.employerContribution ?? "");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setType(selectedType);
    
    if (selectedType === "SSF") {
      setEmpContri(11); setEmprContri(20);
    } else if (selectedType === "NONE") {
      setEmpContri(0); setEmprContri(0);
    } else {
      setEmpContri(""); setEmprContri("");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <SelectField
          label="Retirement Scheme (अवकाश योजना)"
          name="ssf.type" 
          options={[{ value: "SSF", label: "SSF" }, { value: "PF_CIT", label: "EPF + CIT" }, { value: "NONE", label: "None" }]}
          value={type}
          onChange={handleTypeChange} 
        />
        <FormField
          label="Identity Number (SSF/EPF No.)"
          name="ssf.idNumber" 
          disabled={type === "NONE"}
          required={type !== "NONE"}
          pattern={type === "SSF" ? "[0-9]{11}" : undefined}
          defaultValue={initialData?.ssf?.idNumber} 
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500">Employee Contri (%)</label>
          <input type="number" name="ssf.employeeContribution" className="w-full border px-3 py-2 border-zinc-300 rounded-md bg-white text-sm" value={empContri} onChange={(e) => setEmpContri(e.target.value)} readOnly={type === "SSF"} disabled={type === "NONE"} required={type !== "NONE"} min="0" max="100" step="0.01" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500">Employer Contri (%)</label>
          <input type="number" name="ssf.employerContribution" className="w-full border px-3 py-2 border-zinc-300 rounded-md bg-white text-sm" value={emprContri} onChange={(e) => setEmprContri(e.target.value)} readOnly={type === "SSF"} disabled={type === "NONE"} required={type !== "NONE"} min="0" max="100" step="0.01" />
        </div>
      </div>
    </div>
  );
};
export default SSFPFcontri;