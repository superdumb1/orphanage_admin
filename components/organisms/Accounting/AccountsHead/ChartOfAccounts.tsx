"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AccountSection } from "./AccountSection";
import { generateAccountsPDF } from "@/lib/generatePDF";
import { useUIModals } from "@/hooks/useUIModal";

export default function ChartOfAccounts({ initialAccounts }: { initialAccounts: any[] }) {
  const { openAccountHeadForm } = useUIModals();
  
  // Track which accordion is open. Default to "INCOME".
  const [openSection, setOpenSection] = useState<string>("INCOME");

  const filterByType = (type: string) => initialAccounts.filter((a) => a.type === type);

  // Helper to toggle sections
  const handleToggle = (section: string) => {
    setOpenSection(prev => prev === section ? "" : section);
  };

  return (
    <div className="transition-colors duration-500 mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-end ">
        <div>
          <h2 className="text-2xl font-black text-text tracking-tighter">
            Chart of Accounts
          </h2>
          <p className="text-sm text-text-muted font-medium mt-1">
            Structural hierarchy of organizational financial heads
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => generateAccountsPDF(initialAccounts)}
          className="border border-border text-text-muted hover:text-text hover:bg-shaded font-bold px-6 h-10 transition-all active:scale-95 shadow-sm"
        >
          📥 Export PDF
        </Button>
      </div>

      {/* ACCORDION STACK */}
      <div className="flex flex-col gap-4">
        
        <AccountSection
          title="Incomes"
          heads={filterByType("INCOME")}
          theme="success"
          isOpen={openSection === "INCOME"}
          onToggle={() => handleToggle("INCOME")}
          onAdd={() => openAccountHeadForm({ isIncomeHead: true })}
        />

        <AccountSection
          title="Expenses"
          heads={filterByType("EXPENSE")}
          theme="danger"
          isOpen={openSection === "EXPENSE"}
          onToggle={() => handleToggle("EXPENSE")}
          onAdd={() => openAccountHeadForm({ isIncomeHead: false })}
        />

        <AccountSection
          title="Assets"
          heads={filterByType("ASSET")}
          theme="primary"
          isOpen={openSection === "ASSET"}
          onToggle={() => handleToggle("ASSET")}
          onAdd={() => openAccountHeadForm({ isIncomeHead: true })}
        />

        <AccountSection
          title="Liabilities"
          heads={filterByType("LIABILITY")}
          theme="warning"
          isOpen={openSection === "LIABILITY"}
          onToggle={() => handleToggle("LIABILITY")}
          onAdd={() => openAccountHeadForm({ isIncomeHead: false })}
        />
        
      </div>
    </div>
  );
}