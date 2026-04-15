"use client";

import React from 'react';

interface StatBoxProps {
  label: string;
  subLabel?: string;
  value: string | number;
  icon: React.ReactNode;
  // Replaced arbitrary strings with strict semantic variants
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}

export const StatBox: React.FC<StatBoxProps> = ({ 
  label, 
  subLabel, 
  value, 
  icon, 
  variant = "primary" 
}) => {
  
  // Map the variant to your specific text and background-tint theme tokens
  const variants = {
    primary: { text: "text-primary", bg: "bg-primary/10" },
    success: { text: "text-success", bg: "bg-success/10" },
    warning: { text: "text-warning", bg: "bg-warning/10" },
    danger:  { text: "text-danger", bg: "bg-danger/10" },
    accent:  { text: "text-accent", bg: "bg-accent/10" },
  };

  const selectedVariant = variants[variant];

  return (
    // Updated: bg-white -> bg-card, border-zinc-200 -> border-border
    <div className="bg-card p-6 rounded-dashboard border border-border shadow-glow flex justify-between items-center transition-colors duration-500">
      
      {/* TEXT INFO */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-black text-text-muted uppercase tracking-[0.1em]">
          {label}
        </p>
        
        {subLabel && (
          <p className="text-[10px] text-text-muted/60 -mt-1 font-medium">
            {subLabel}
          </p>
        )}
        
        <p className={`text-2xl font-black mt-1 ${selectedVariant.text}`}>
          {value}
        </p>
      </div>

      {/* ICON WRAPPER: Automatically tints based on the variant */}
      <div className={`p-4 rounded-xl flex items-center justify-center ${selectedVariant.bg} ${selectedVariant.text} text-2xl`}>
        {icon}
      </div>
      
    </div>
  );
};