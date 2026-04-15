"use client";
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`
        w-full px-4 py-3 text-sm rounded-xl
        /* Layering: bg-bg creates an inset look inside bg-card containers */
        bg-bg text-text
        border border-border
        placeholder:text-text-muted/40
        outline-none
        transition-all duration-300

        /* Interactive States */
        hover:border-border/80
        focus:ring-4 focus:ring-primary/10
        focus:border-primary
        focus:shadow-glow

        /* Accessibility & Utility */
        disabled:opacity-50 disabled:bg-shaded disabled:cursor-not-allowed
        color-scheme-adaptive
        
        ${className}
      `}
      {...props}
    />
  );
};