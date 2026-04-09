import { FormField } from "../../molecules/FormField";
import React from "react";
import { StaffFormInputs } from "@/types/StaffFormInputs";

const BasicFields = [
  { name: "basicSalary", label: "Basic Salary (आधारभूत तलब)" },
  { name: "grade", label: "Grade Amount (ग्रेड)" },
  { name: "dearnessAllowance", label: "Dearness Allowance (महंगी भत्ता)" },
] as const;

const AllowancesFields = [
  { name: "houseRent", label: "House Rent (घर भाडा)" },
  { name: "medical", label: "Medical (चिकित्सा)" },
  { name: "transport", label: "Transport (यातायात)" },
  { name: "food", label: "Food (खाजा)" },
  { name: "communication", label: "Communication (सञ्चार)" },
  { name: "other", label: "Other Allowances (अन्य)" },
] as const;

// THE FIX: We extract the exact string literal types from your arrays above.
// This guarantees TypeScript knows these are ONLY numbers, never the "allowances" object.
type BasicFieldKey = typeof BasicFields[number]["name"];
type AllowanceFieldKey = typeof AllowancesFields[number]["name"];

const SalaryDropdownForm = ({ initialData }: { initialData?: StaffFormInputs }) => {
  return (
    <div className="p-5 flex flex-col gap-6">
      
      {/* BASIC FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BasicFields.map((field) => (
          <FormField 
            key={field.name} 
            name={field.name} 
            type="number" 
            label={field.label} 
            // Look how clean this is now!
            defaultValue={initialData?.salary?.[field.name as BasicFieldKey]} 
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs font-bold text-zinc-400 uppercase">Allowances (भत्ता)</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* ALLOWANCE FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AllowancesFields.map((field) => (
          <FormField 
            key={field.name} 
            name={field.name} 
            type="number" 
            label={field.label} 
            // And here!
            defaultValue={initialData?.salary?.allowances?.[field.name as AllowanceFieldKey]} 
          />
        ))}
      </div>

      {/* BONUS & INSURANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <FormField 
            label="Festival Bonus Months" 
            name="festivalBonusMonths" 
            type="number" 
            defaultValue={initialData?.salary?.festivalBonusMonths ?? 1} 
        />
        <FormField 
            label="Insurance Premium (Deduction)" 
            name="insurancePremium" 
            type="number" 
            defaultValue={initialData?.salary?.insurancePremium} 
        />
      </div>
    </div>
  );
};

export default SalaryDropdownForm;