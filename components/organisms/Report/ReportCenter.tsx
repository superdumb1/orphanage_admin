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
        // Updated: bg-white -> bg-card, border-zinc-200 -> border-border
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card p-6 rounded-dashboard border border-border shadow-glow transition-colors duration-500">

            {/* FINANCIAL */}
            <div className="space-y-3">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                    Financial Reports
                </p>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleDaybook}
                        variant="ghost"
                        // Updated: bg-white -> bg-bg, border-zinc-200 -> border-border
                        className="justify-start bg-bg border border-border text-xs font-bold hover:bg-shaded transition-all"
                    >
                        📄 Daybook (Today)
                    </Button>

                    <Button
                        onClick={handleMonthly}
                        variant="ghost"
                        className="justify-start bg-bg border border-border text-xs font-bold hover:bg-shaded transition-all"
                    >
                        📅 Monthly Summary
                    </Button>
                </div>
            </div>

            {/* INVENTORY */}
            <div className="space-y-3">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                    Inventory Reports
                </p>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleInventoryReport}
                        variant="ghost"
                        className="justify-start bg-bg border border-border text-xs font-bold hover:bg-shaded transition-all"
                    >
                        📦 Inventory Status
                    </Button>
                </div>
            </div>

            {/* INFO PANEL: Updated to use Invert tokens for high contrast */}
            <div className="flex items-center justify-center p-6 bg-bg-invert rounded-xl shadow-glow">
                <p className="text-[11px] text-text-invert text-center font-black uppercase tracking-widest leading-relaxed opacity-80">
                    Audit-Ready <br /> PDF Generation
                </p>
            </div>
        </div>
    );
}