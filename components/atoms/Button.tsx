import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}) => {

  const base = `
    px-4 py-2 rounded-xl font-medium text-sm
    transition-all duration-200
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary text-text-invert
      hover:opacity-90 active:scale-95
      focus:ring-primary shadow-glow
    `,

    secondary: `
      bg-card text-text border border-border
      hover:bg-shaded
      focus:ring-primary
    `,

    danger: `
      bg-danger text-text-invert
      hover:opacity-90 active:scale-95
      focus:ring-danger
    `,

    ghost: `
      bg-transparent text-text-muted
      hover:bg-shaded hover:text-text
      focus:ring-primary
    `
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};