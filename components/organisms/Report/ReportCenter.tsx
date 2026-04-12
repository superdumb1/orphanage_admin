"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { generateStandardPDF } from "@/lib/generatePDF";

export default function ReportCenter({ transactions, inventory }: { transactions: any[], inventory: any[] }) {
    
    const handleDaybook = () => {
        const today = new Date().toLocaleDateString('en-GB');
        const todayData = transactions.filter(t => new Date(t.date).toLocaleDateString('en-GB') === today);
        
        generateStandardPDF({
            title: "Daily Transaction Daybook",
            subtitle: `Date: ${today}`,
            filename: `Daybook_${today}`,
            headers: [['Account', 'Description', 'Method', 'Amount']],
            data: todayData.map(t => [t.accountHead?.name, t.description, t.paymentMethod, t.type === 'INCOME' ? `+${t.amount}` : `-${t.amount}`]),
            colorCodeAmount: true
        });
    };

    const handleMonthly = () => {
        const now = new Date();
        const monthName = now.toLocaleString('default', { month: 'long' });
        const monthData = transactions.filter(t => new Date(t.date).getMonth() === now.getMonth());
        
        const total = monthData.reduce((acc, curr) => curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount, 0);

        generateStandardPDF({
            title: `Monthly Financial Report - ${monthName}`,
            filename: `Report_${monthName}_${now.getFullYear()}`,
            summaryLabel: "Net Cashflow for Month",
            summaryValue: `NPR ${total.toLocaleString()}`,
            headers: [['Date', 'Account', 'Description', 'Amount']],
            data: monthData.map(t => [new Date(t.date).toLocaleDateString('en-GB'), t.accountHead?.name, t.description, t.type === 'INCOME' ? `+${t.amount}` : `-${t.amount}`]),
            colorCodeAmount: true
        });
    };

    const handleInventoryReport = () => {
        generateStandardPDF({
            title: "Current Inventory Stock Report",
            subtitle: "Full warehouse asset list",
            filename: "Inventory_Status",
            headers: [['Item Name', 'Category', 'Current Stock', 'Unit', 'Status']],
            data: inventory.map(i => [
                i.name, 
                i.category, 
                i.currentStock, 
                i.unit, 
                i.currentStock <= i.minimumStockLevel ? "LOW STOCK" : "Healthy"
            ]),
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 p-6 rounded-3xl border border-zinc-200">
            <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Financial Reports</p>
                <div className="flex flex-col gap-2">
                    <Button onClick={handleDaybook} variant="ghost" className="justify-start bg-white border border-zinc-200 text-xs font-bold">📄 Export Daybook (Today)</Button>
                    <Button onClick={handleMonthly} variant="ghost" className="justify-start bg-white border border-zinc-200 text-xs font-bold">📅 Export Monthly Summary</Button>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Warehouse Reports</p>
                <div className="flex flex-col gap-2">
                    <Button onClick={handleInventoryReport} variant="ghost" className="justify-start bg-white border border-zinc-200 text-xs font-bold">📦 Current Inventory PDF</Button>
                </div>
            </div>

            <div className="flex items-center justify-center p-4 bg-zinc-900 rounded-2xl">
                <p className="text-[10px] text-zinc-400 text-center font-medium">Select a report type to generate a signed PDF document for the board.</p>
            </div>
        </div>
    );
}