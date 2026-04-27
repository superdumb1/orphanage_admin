"use client";
import React from 'react';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  onAddItem?: () => void; // Renamed to follow naming conventions
}

export const SelectField: React.FC<SelectFieldProps> = ({
  onAddItem,
  label,
  options,
  id,
  required,
  error,
  className = '',
  onChange,
  ...props
}) => {

  // ✨ Handle the "Add New" selection
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "ADD_NEW_TRIGGER" && onAddItem) {
      onAddItem();
      // Reset the select value so it doesn't stay stuck on "Add New"
      e.target.value = ""; 
      return;
    }
    if (onChange) onChange(e);
  };

  return (
    <div className="flex flex-col gap-2 w-full transition-colors duration-500">
      <label
        htmlFor={id}
        className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 opacity-90"
      >
        {label}{" "}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div className="relative group">
        <select
          id={id}
          required={required}
          onChange={handleSelectChange} // Use the custom handler
          {...props}
          className={`
            w-full px-4 py-3 text-sm rounded-xl
            bg-white text-zinc-900
            border border-zinc-200
            outline-none appearance-none cursor-pointer
            transition-all duration-300
            hover:border-zinc-300
            focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900
            ${error ? 'border-red-500 focus:ring-red-100' : ''}
            ${className}
          `}
        >
          <option value="" disabled hidden>
            Select an option...
          </option>

          {options.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="text-zinc-900 bg-white"
            >
              {opt.label}
            </option>
          ))}

          {/* ✨ Valid way to add an "Add New" option */}
          {onAddItem && (
            <option 
              value="ADD_NEW_TRIGGER" 
              className="text-primary font-bold bg-zinc-50"
            >
              + Add New Option
            </option>
          )}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 opacity-50 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <span className="text-[11px] text-red-500 font-bold mt-1 animate-in fade-in slide-in-from-top-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};