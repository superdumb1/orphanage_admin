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
    <div className="flex flex-col gap-1 w-full">
      
      {/* Label */}
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-text"
      >
        {label}{" "}
        {required && <span className="text-danger">*</span>}
      </label>
      
      {/* Input */}
      <Input 
        id={id} 
        required={required} 
        className={`
          ${error 
            ? "border-danger focus:ring-danger" 
            : "border-border focus:ring-primary"
          }
        `}
        {...props} 
      />
      
      {/* Error */}
      {error && (
        <span className="text-xs text-danger mt-1 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};