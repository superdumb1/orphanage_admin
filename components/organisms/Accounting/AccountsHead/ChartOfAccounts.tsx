"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AccountSection } from "./AccountSection";
import { generateAccountsPDF } from "@/lib/generatePDF";
import { useUIModals } from "@/hooks/useUIModal";
import { DownloadCloud } from "lucide-react";

export default function ChartOfAccounts({ initialAccounts }: { initialAccounts: any[] }) {
  const { openAccountHeadForm } = useUIModals();
  const [openSection, setOpenSection] = useState<string>("INCOME");

  const filterByType = (type: string) => initialAccounts.filter((a) => a.type === type);
  const handleToggle = (section: string) => setOpenSection(prev => prev === section ? "" : section);

  return (
    <div className="flex flex-col gap-8 transition-colors duration-500">
      {/* ✨ KREE STANDARD MODULE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-5 md:p-6 rounded-[2rem] shadow-sm border border-border transition-colors duration-500 mb-8">

        {/* BRANDING & IDENTITY */}
        <div className="flex items-center gap-4 w-full">
          {/* Standardized Primary Icon Block */}
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl border border-primary/20 shrink-0">
            🏛️
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h1 className="font-ubuntu text-xl md:text-2xl font-black text-text tracking-tight truncate">
              Structural Hierarchy
            </h1>
            <p className="font-ubuntu text-xs md:text-sm text-text-muted font-medium truncate">
              Organizational Chart of Account Heads
            </p>
          </div>
        </div>

        {/* EXPORT ACTION */}
        <Button
          onClick={() => generateAccountsPDF(initialAccounts)}
          className="w-full sm:w-auto border border-border text-text hover:text-text hover:bg-shaded font-bold py-3 sm:py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <DownloadCloud size={16} />
          <span>Export Audit PDF</span>
        </Button>
      </div>

      {/* ACCORDION STACK */}
      <div className="flex flex-col gap-4">
        {[
          { title: "Incomes", type: "INCOME", theme: "success" as const, addIncome: true },
          { title: "Expenses", type: "EXPENSE", theme: "danger" as const, addIncome: false },
          { title: "Assets", type: "ASSET", theme: "primary" as const, addIncome: true },
          { title: "Liabilities", type: "LIABILITY", theme: "warning" as const, addIncome: false }
        ].map((sec) => (
          <AccountSection
            key={sec.type}
            title={sec.title}
            heads={filterByType(sec.type)}
            theme={sec.theme}
            isOpen={openSection === sec.type}
            onToggle={() => handleToggle(sec.type)}
            onAdd={() => openAccountHeadForm({ isIncomeHead: sec.addIncome })}
          />
        ))}
      </div>
    </div>
  );
}