import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`
        w-full px-3 py-2 text-sm rounded-xl
        bg-card text-text
        border border-border
        placeholder:text-text-muted
        outline-none
        transition-all duration-200

        focus:ring-2 focus:ring-primary
        focus:border-primary
        focus:shadow-glow

        ${className}
      `}
      {...props}
    />
  );
};