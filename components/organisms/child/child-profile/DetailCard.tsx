import React from "react";

export const DetailCard = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="
    bg-white dark:bg-zinc-950
    p-6 rounded-xl shadow-sm border
    border-zinc-200 dark:border-zinc-800
    flex flex-col gap-4 h-full
  ">
    <h2 className="
      text-lg font-black mb-3 border-b pb-2
      text-zinc-900 dark:text-zinc-100
      border-zinc-100 dark:border-zinc-800
    ">
      {title}
    </h2>

    <div className="flex flex-col gap-2">
      {children}
    </div>
  </div>
);

export const DataRow = ({
  label,
  value,
  color
}: {
  label: string;
  value: string | number;
  color?: string;
}) => (
  <p className="text-sm text-zinc-600 dark:text-zinc-300">
    <strong className="
      text-zinc-900 dark:text-zinc-100
      w-28 inline-block
    ">
      {label}:
    </strong>

    <span className={color ?? "text-zinc-700 dark:text-zinc-200"}>
      {value}
    </span>
  </p>
);