"use client";
import React, { useState } from "react";
import { generateStandardPDF } from "@/lib/generatePDF";
import { generateExcelReport } from "@/lib/generateExcel";
import ReportCenterModal from "./ReportCenterModal";
import ReportCommandBar from "./ReportCommandBar";
import { Button } from "@/components/atoms/Button";
import { ChevronDown } from "lucide-react"; // ✨ Imported Chevron for accordion

export default function ReportCenter({ transactions, accounts }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // ✨ 1. State to track mobile accordion (Defaults to closed)
    const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="bg-card border border-border rounded-dashboard shadow-glow mb-8 overflow-hidden transition-colors duration-500">

            {/* HEADER */}
            <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 transition-colors">

                {/* Title & Mobile Toggle */}
                <div className="flex justify-between items-start w-full md:w-auto">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-text tracking-tighter">
                            Report Command Center
                        </h2>
                        <p className="text-sm text-text-muted font-medium mt-1">
                            {filter.timeframe === "CUSTOM" && filter.startDate
                                ? `Selected Range: ${filter.startDate} → ${filter.endDate}`
                                : "Generate structured financial audit reports"}
                        </p>
                    </div>

                    {/* ✨ 2. The Accordion Toggle Button (Hidden on Desktop) */}
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="md:hidden mt-1 p-2 bg-background rounded-xl border border-border text-text-muted hover:text-text transition-colors shadow-sm"
                        aria-label="Toggle Filters"
                    >
                        <ChevronDown 
                            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                            size={20} 
                        />
                    </button>
                </div>

                {/* The Generate Button stays visible on mobile so default reports are always 1-click away */}
                <Button
                    onClick={handleGenerate}
                    className="btn-primary w-full md:w-auto px-10 h-11 shadow-sm shrink-0"
                >
                    Generate Report
                </Button>
            </div>

            {/* ✨ 3. THE ACCORDION WRAPPER */}
            {/* Uses CSS Grid animation: slides open smoothly on mobile, always open on md: screens */}
            <div 
                className={`grid transition-all duration-300 ease-in-out md:grid-rows-[1fr] md:opacity-100 ${
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="bg-shaded/50 transition-colors">
                        <ReportCommandBar
                            filter={filter}
                            setFilter={setFilter}
                            accounts={accounts}
                            setIsModalOpen={setIsModalOpen}
                        />
                    </div>
                </div>
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