import React from 'react';

interface StatBoxProps {
  label: string;
  subLabel?: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, subLabel, value, icon, color = "text-blue-600" }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
        {subLabel && <p className="text-[10px] text-zinc-400 -mt-1">{subLabel}</p>}
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-zinc-50 text-xl`}>
        {icon}
      </div>
    </div>
  );
};