"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { generateStandardPDF } from "@/lib/generatePDF";

export default function ReportCenter({
    transactions,
    inventory,
}: {
    transactions: any[];
    inventory: any[];
}) {
    const handleDaybook = () => {
        const today = new Date().toLocaleDateString("en-GB");

        const todayData = transactions.filter(
            (t) => new Date(t.date).toLocaleDateString("en-GB") === today
        );

        generateStandardPDF({
            title: "Daily Transaction Daybook",
            subtitle: `Date: ${today}`,
            filename: `Daybook_${today}`,
            headers: [["Account", "Description", "Method", "Amount"]],
            data: todayData.map((t) => [
                t.accountHead?.name,
                t.description,
                t.paymentMethod,
                t.type === "INCOME" ? `+${t.amount}` : `-${t.amount}`,
            ]),
            colorCodeAmount: true,
        });
    };

    const handleMonthly = () => {
        const now = new Date();
        const monthName = now.toLocaleString("default", { month: "long" });

        const monthData = transactions.filter(
            (t) => new Date(t.date).getMonth() === now.getMonth()
        );

        const total = monthData.reduce(
            (acc, curr) =>
                curr.type === "INCOME" ? acc + curr.amount : acc - curr.amount,
            0
        );

        generateStandardPDF({
            title: `Monthly Financial Report - ${monthName}`,
            filename: `Report_${monthName}_${now.getFullYear()}`,
            summaryLabel: "Net Cashflow for Month",
            summaryValue: `NPR ${total.toLocaleString()}`,
            headers: [["Date", "Account", "Description", "Amount"]],
            data: monthData.map((t) => [
                new Date(t.date).toLocaleDateString("en-GB"),
                t.accountHead?.name,
                t.description,
                t.type === "INCOME" ? `+${t.amount}` : `-${t.amount}`,
            ]),
            colorCodeAmount: true,
        });
    };

    const handleInventoryReport = () => {
        generateStandardPDF({
            title: "Inventory Stock Report",
            subtitle: "Warehouse asset overview",
            filename: "Inventory_Status",
            headers: [["Item Name", "Category", "Stock", "Unit", "Status"]],
            data: inventory.map((i) => [
                i.name,
                i.category,
                i.currentStock,
                i.unit,
                i.currentStock <= i.minimumStockLevel ? "LOW STOCK" : "OK",
            ]),
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">

            {/* FINANCIAL */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Financial Reports
                </p>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleDaybook}
                        variant="ghost"
                        className="justify-start bg-white border border-zinc-200 text-xs font-bold hover:bg-zinc-50"
                    >
                        📄 Daybook (Today)
                    </Button>

                    <Button
                        onClick={handleMonthly}
                        variant="ghost"
                        className="justify-start bg-white border border-zinc-200 text-xs font-bold hover:bg-zinc-50"
                    >
                        📅 Monthly Summary
                    </Button>
                </div>
            </div>

            {/* INVENTORY */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Inventory Reports
                </p>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleInventoryReport}
                        variant="ghost"
                        className="justify-start bg-white border border-zinc-200 text-xs font-bold hover:bg-zinc-50"
                    >
                        📦 Inventory Status
                    </Button>
                </div>
            </div>

            {/* INFO PANEL */}
            <div className="flex items-center justify-center p-5 bg-zinc-900 rounded-2xl">
                <p className="text-[10px] text-zinc-400 text-center font-medium leading-relaxed">
                    Generate audit-ready PDF reports for finance and warehouse
                    tracking.
                </p>
            </div>
        </div>
    );
}