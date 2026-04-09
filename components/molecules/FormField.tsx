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
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <Input id={id} required={required} {...props} />
      
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};