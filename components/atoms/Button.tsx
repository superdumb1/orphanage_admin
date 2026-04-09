import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', className = '', children, ...props 
}) => {
  const base = "px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500 border border-zinc-300",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};