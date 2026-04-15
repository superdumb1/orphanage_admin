"use client";
import React from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, error, id, required, ...props 
}) => {
  return (
    <div className="flex flex-col gap-2 w-full transition-colors duration-500">
      
      {/* LABEL: Upgraded to the wide-tracked Micro-caps aesthetic */}
      <label 
        htmlFor={id} 
        className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted opacity-90 px-1"
      >
        {label}{" "}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      
      {/* INPUT: Calibrated focus rings and error borders */}
      <Input 
        id={id} 
        required={required} 
        className={`
          transition-all duration-300
          ${error 
            ? "border-danger focus:ring-danger/20" 
            : "border-border focus:ring-primary/20 focus:border-primary"
          }
          /* Ensure text inside inherits theme color */
          text-text placeholder:text-text-muted/40
        `}
        {...props} 
      />
      
      {/* ERROR: Animated for better UX feedback */}
      {error && (
        <span className="text-[11px] text-danger font-bold mt-1 px-1 animate-in fade-in slide-in-from-top-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};