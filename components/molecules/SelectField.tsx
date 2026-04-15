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
    <div className="flex flex-col gap-1 w-full">

      {/* Label */}
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}{" "}
        {required && <span className="text-danger">*</span>}
      </label>

      {/* Select */}
      <select
        id={id}
        required={required}
        {...props}
        className={`
          w-full px-3 py-2 text-sm rounded-xl
          bg-card text-text
          border border-border
          outline-none
          transition-all duration-200

          focus:ring-2 focus:ring-primary
          focus:border-primary

          ${className}
        `}
      >
        <option value="" className="text-text-muted">
          Select...
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

      {/* Error */}
      {error && (
        <span className="text-xs text-danger font-medium mt-1">
          {error}
        </span>
      )}
    </div>
  );
};