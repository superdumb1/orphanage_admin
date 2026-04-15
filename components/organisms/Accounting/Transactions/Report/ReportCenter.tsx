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
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm mb-6 overflow-hidden">

            {/* HEADER */}
            <div className="p-6 md:p-8 border-b border-zinc-100 flex justify-between items-start gap-6">

                <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tighter">
                        Report Command Center
                    </h2>

                    <p className="text-xs text-zinc-500 font-medium mt-1">
                        {filter.timeframe === "CUSTOM" && filter.startDate
                            ? `Selected Range: ${filter.startDate} → ${filter.endDate}`
                            : "Generate structured financial audit reports"}
                    </p>
                </div>

                <Button
                    onClick={handleGenerate}
                    className="
                        bg-zinc-900 text-white font-black px-8 h-11
                        rounded-xl shadow-sm
                        hover:bg-zinc-800 transition
                    "
                >
                    Generate
                </Button>
            </div>

            {/* COMMAND BAR */}
            <div className="p-6 md:p-8 bg-zinc-50 border-b border-zinc-100">
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