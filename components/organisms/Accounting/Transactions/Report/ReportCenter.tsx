"use client";
import React, { useState } from "react";
import { generateStandardPDF } from "@/lib/generatePDF";
import { generateExcelReport } from "@/lib/generateExcel";
import ReportCenterModal from "./ReportCenterModal";
import ReportCommandBar from "./ReportCommandBar";
import { Button } from "@/components/atoms/Button";

export default function ReportCenter({ transactions, accounts }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filter, setFilter] = useState({
        timeframe: "MONTH",
        type: "ALL",
        accountId: "ALL",
        startDate: "",
        endDate: "",
        format: "PDF"
    });

    const handleGenerate = () => {
        const now = new Date();

        const filtered = transactions.filter((t: any) => {
            const d = new Date(t.date);
            let inTime = true;

            if (filter.timeframe === "DAY") {
                inTime = d.toDateString() === now.toDateString();
            } else if (filter.timeframe === "WEEK") {
                inTime = d >= new Date(new Date().setDate(now.getDate() - 7));
            } else if (filter.timeframe === "MONTH") {
                inTime =
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear();
            } else if (filter.timeframe === "YEAR") {
                inTime = d.getFullYear() === now.getFullYear();
            } else if (filter.timeframe === "CUSTOM") {
                if (!filter.startDate || !filter.endDate) return false;
                inTime =
                    d >= new Date(filter.startDate) &&
                    d <= new Date(filter.endDate);
            }

            const matchesType =
                filter.type === "ALL" || t.type === filter.type;

            const matchesAccount =
                filter.accountId === "ALL" ||
                t.accountHead?._id === filter.accountId;

            return inTime && matchesType && matchesAccount;
        });

        if (!filtered.length) {
            alert("No transactions found.");
            return;
        }

        if (filter.format === "PDF") {
            generateStandardPDF({
                title: `${filter.timeframe} Report`,
                filename: `Report_${Date.now()}`,
                headers: [["Date", "Account", "Description", "Amount"]],
                data: filtered.map((t: any) => [
                    new Date(t.date).toLocaleDateString(),
                    t.accountHead?.name,
                    t.description,
                    t.type === "INCOME"
                        ? `+${t.amount}`
                        : `-${t.amount}`
                ]),
                colorCodeAmount: true
            });
        } else {
            generateExcelReport(
                filtered.map((t: any) => ({
                    Date: new Date(t.date).toLocaleDateString(),
                    Account: t.accountHead?.name,
                    Amount: t.amount,
                    Type: t.type
                })),
                ["Date", "Account", "Amount", "Type"],
                "Finance_Export"
            );
        }
    };

    return (
        // Wrapper: bg-white -> bg-card, border-zinc-200 -> border-border, rounded-3xl -> rounded-dashboard
        <div className="bg-card border border-border rounded-dashboard shadow-glow mb-8 overflow-hidden transition-colors duration-500">

            {/* HEADER: border-zinc-100 -> border-border */}
            <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors">

                <div>
                    {/* Typography: text-zinc-900 -> text-text */}
                    <h2 className="text-xl md:text-2xl font-black text-text tracking-tighter">
                        Report Command Center
                    </h2>

                    {/* Subtitle: text-zinc-500 -> text-text-muted */}
                    <p className="text-sm text-text-muted font-medium mt-1">
                        {filter.timeframe === "CUSTOM" && filter.startDate
                            ? `Selected Range: ${filter.startDate} → ${filter.endDate}`
                            : "Generate structured financial audit reports"}
                    </p>
                </div>

                {/* Button: Replaced hardcoded zinc classes with btn-primary */}
                <Button
                    onClick={handleGenerate}
                    className="btn-primary w-full md:w-auto px-10 h-11 shadow-sm shrink-0"
                >
                    Generate Report
                </Button>
            </div>

            {/* COMMAND BAR WRAPPER: bg-zinc-50 -> bg-shaded/50 */}
            <div className=" bg-shaded/50 transition-colors">
                <ReportCommandBar
                    filter={filter}
                    setFilter={setFilter}
                    accounts={accounts}
                    setIsModalOpen={setIsModalOpen}
                />
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <ReportCenterModal
                    filter={filter}
                    setFilter={setFilter}
                    setIsModalOpen={setIsModalOpen}
                />
            )}
        </div>
    );
}