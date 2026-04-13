"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AddAccountHeadModal } from "../modals/AddAccountHeadModal";
import { AccountSection } from "./AccountSection";
import { generateAccountsPDF } from "@/lib/generatePDF";

export default function ChartOfAccounts({ initialAccounts }: { initialAccounts: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIncomeHead, setIsIncomeHead] = useState(true);

    const filterByType = (type: string) => initialAccounts.filter(a => a.type === type);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
                <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tighter">Chart of Accounts</h2>
                    <p className="text-xs text-zinc-500 font-medium">Structure of your organizational accounts.</p>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => generateAccountsPDF(initialAccounts)}
                    className="border border-zinc-200 text-zinc-600 font-bold"
                >
                    📥 Export PDF
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountSection 
                    title="Incomes" heads={filterByType('INCOME')} theme="emerald" 
                    subTypes={['Unrestricted', 'Restricted', 'Grants', 'Event']}
                    onAdd={() => { setIsIncomeHead(true); setIsModalOpen(true); }}
                />
                <AccountSection 
                    title="Expenses" heads={filterByType('EXPENSE')} theme="rose" 
                    subTypes={['Living', 'Education', 'Health', 'Payroll', 'Utilities']}
                    onAdd={() => { setIsIncomeHead(false); setIsModalOpen(true); }}
                />
                <AccountSection 
                    title="Assets" heads={filterByType('ASSET')} theme="blue" 
                    subTypes={['Cash', 'Bank', 'Fixed Asset']}
                    onAdd={() => { setIsIncomeHead(true); setIsModalOpen(true); }}
                />
                <AccountSection 
                    title="Liabilities" heads={filterByType('LIABILITY')} theme="amber" 
                    subTypes={['Loan', 'Payable']}
                    onAdd={() => { setIsIncomeHead(false); setIsModalOpen(true); }}
                />
            </div>

            <AddAccountHeadModal 
                isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isIncomeHead={isIncomeHead} 
            />
        </div>
    );
}