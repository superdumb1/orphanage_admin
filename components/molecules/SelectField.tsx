"use client";
import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  id,
  required,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full transition-colors duration-500">

      {/* LABEL: Upgraded to OrphanAdmin Micro-caps style */}
      <label 
        htmlFor={id} 
        className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted opacity-90"
      >
        {label}{" "}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>

      {/* SELECT ELEMENT */}
      <div className="relative group">
        <select
          id={id}
          required={required}
          {...props}
          className={`
            w-full px-4 py-3 text-sm rounded-xl
            bg-bg text-text
            border border-border
            outline-none
            appearance-none
            cursor-pointer
            transition-all duration-300
            
            hover:border-border/80
            focus:ring-2 focus:ring-primary/20
            focus:border-primary
            
            color-scheme-adaptive
            ${error ? 'border-danger focus:ring-danger/20' : ''}
            ${className}
          `}
        >
          <option value="" className="text-text-muted">
            Select an option...
          </option>

          {options.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-text bg-card"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* CUSTOM ARROW: Native select arrows are often inconsistent across OS/Themes */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted opacity-50 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <span className="text-[11px] text-danger font-bold mt-1 animate-in fade-in slide-in-from-top-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};