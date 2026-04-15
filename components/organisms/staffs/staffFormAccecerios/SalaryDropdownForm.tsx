"use client";

import { FormField } from "../../../molecules/FormField";
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

type Props = {
  initialData?: StaffFormInputs;
};

const SalaryDropdownForm = ({ initialData }: Props) => {
  const salary = initialData?.salary;
  const allowances = salary?.allowances;

  return (
    // Updated: Changed container padding and ensured it inherits bg-card from parent
    <div className="p-6 flex flex-col gap-8 bg-card transition-colors duration-500">

      {/* BASIC FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BasicFields.map(({ name, label }) => (
          <FormField
            key={name}
            name={name}
            type="number"
            label={label}
            defaultValue={salary?.[name]}
            className="text-text"
          />
        ))}
      </div>

      {/* DIVIDER: Updated bg-zinc-200 to bg-border and text-zinc-400 to text-text-muted */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
          Allowances (भत्ता)
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ALLOWANCES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AllowancesFields.map(({ name, label }) => (
          <FormField
            key={name}
            name={name}
            type="number"
            label={label}
            defaultValue={allowances?.[name]}
            className="text-text"
          />
        ))}
      </div>

      {/* BONUS + INSURANCE: Updated border-t to border-border */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
        <FormField
          label="Festival Bonus Months"
          name="festivalBonusMonths"
          type="number"
          defaultValue={salary?.festivalBonusMonths ?? 1}
          className="text-text"
        />

        <FormField
          label="Insurance Premium (Deduction)"
          name="insurancePremium"
          type="number"
          defaultValue={salary?.insurancePremium}
          className="text-text"
        />
      </div>

    </div>
  );
};

export default SalaryDropdownForm;