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

// Derived types (no manual typing needed)
type Salary = StaffFormInputs["salary"];
type BasicKey = typeof BasicFields[number]["name"];
type AllowanceKey = typeof AllowancesFields[number]["name"];

type Props = {
  initialData?: StaffFormInputs;
};

const SalaryDropdownForm = ({ initialData }: Props) => {
  const salary = initialData?.salary;
  const allowances = salary?.allowances;

  return (
    <div className="p-5 flex flex-col gap-6">

      {/* BASIC FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BasicFields.map(({ name, label }) => (
          <FormField
            key={name}
            name={name}
            type="number"
            label={label}
            defaultValue={salary?.[name]}
          />
        ))}
      </div>

      {/* DIVIDER */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-xs font-bold text-zinc-400 uppercase">
          Allowances (भत्ता)
        </span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* ALLOWANCES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AllowancesFields.map(({ name, label }) => (
          <FormField
            key={name}
            name={name}
            type="number"
            label={label}
            defaultValue={allowances?.[name]}
          />
        ))}
      </div>

      {/* BONUS + INSURANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <FormField
          label="Festival Bonus Months"
          name="festivalBonusMonths"
          type="number"
          defaultValue={salary?.festivalBonusMonths ?? 1}
        />

        <FormField
          label="Insurance Premium (Deduction)"
          name="insurancePremium"
          type="number"
          defaultValue={salary?.insurancePremium}
        />
      </div>

    </div>
  );
};

export default SalaryDropdownForm;