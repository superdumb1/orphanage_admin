"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AddAccountHeadModal } from "../modals/AddAccountHeadModal";
import { AccountSection } from "./AccountSection";
import { generateAccountsPDF } from "@/lib/generatePDF";

export default function ChartOfAccounts({
  initialAccounts,
}: {
  initialAccounts: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncomeHead, setIsIncomeHead] = useState(true);

  const filterByType = (type: string) =>
    initialAccounts.filter((a) => a.type === type);

  return (
    <div className="space-y-10 transition-colors duration-500">
      
      {/* HEADER: Updated typography and action styling */}
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-2xl font-black text-text tracking-tighter">
            Chart of Accounts
          </h2>
          <p className="text-sm text-text-muted font-medium mt-1">
            Structural hierarchy of organizational financial heads
          </p>
        </div>

        {/* EXPORT BUTTON: bg-zinc -> border-border/hover:bg-shaded */}
        <Button
          variant="ghost"
          onClick={() => generateAccountsPDF(initialAccounts)}
          className="border border-border text-text-muted hover:text-text hover:bg-shaded font-bold px-6 h-10 transition-all active:scale-95 shadow-sm"
        >
          📥 Export PDF
        </Button>
      </div>

      {/* GRID: 4 Semantic Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INCOMES -> mapped to success (Green) */}
        <AccountSection
          title="Incomes"
          heads={filterByType("INCOME")}
          theme="success"
          subTypes={["Unrestricted", "Restricted", "Grants", "Event"]}
          onAdd={() => {
            setIsIncomeHead(true);
            setIsModalOpen(true);
          }}
        />

        {/* EXPENSES -> mapped to danger (Red) */}
        <AccountSection
          title="Expenses"
          heads={filterByType("EXPENSE")}
          theme="danger"
          subTypes={["Living", "Education", "Health", "Payroll", "Utilities"]}
          onAdd={() => {
            setIsIncomeHead(false);
            setIsModalOpen(true);
          }}
        />

        {/* ASSETS -> mapped to primary (Blue) */}
        <AccountSection
          title="Assets"
          heads={filterByType("ASSET")}
          theme="primary"
          subTypes={["Cash", "Bank", "Fixed Asset"]}
          onAdd={() => {
            setIsIncomeHead(false); 
            setIsModalOpen(true);
          }}
        />

        {/* LIABILITIES -> mapped to warning (Amber) */}
        <AccountSection
          title="Liabilities"
          heads={filterByType("LIABILITY")}
          theme="warning"
          subTypes={["Loan", "Payable"]}
          onAdd={() => {
            setIsIncomeHead(false);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* MODAL: Already themed to use rounded-dashboard and bg-card */}
      <AddAccountHeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIncomeHead={isIncomeHead}
      />
    </div>
  );
}