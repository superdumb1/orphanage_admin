import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ 
  label, options, id, required, ...props 
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        id={id} required={required} {...props}
        className="w-full px-3 text-black py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm"
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};