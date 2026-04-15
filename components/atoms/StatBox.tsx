import React from 'react';

interface StatBoxProps {
  label: string;
  subLabel?: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  subLabel,
  value,
  icon,
  variant = "primary"
}) => {

  const variants = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10",
    accent: "text-accent bg-accent/10"
  };

  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-glow flex justify-between items-center">

      {/* LEFT */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </p>

        {subLabel && (
          <p className="text-[10px] text-text-muted/70 -mt-1">
            {subLabel}
          </p>
        )}

        <p className={`text-xl font-bold ${variants[variant].split(" ")[0]}`}>
          {value}
        </p>
      </div>

      {/* RIGHT ICON */}
      <div className={`p-3 rounded-xl ${variants[variant]} text-xl`}>
        {icon}
      </div>
    </div>
  );
};