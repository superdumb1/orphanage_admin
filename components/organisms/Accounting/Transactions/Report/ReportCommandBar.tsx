"use client";
import React from "react";

export default function ReportCommandBar({
    filter,
    setFilter,
    accounts,
    setIsModalOpen
}: any) {

    const handleTimeframeChange = (val: string) => {
        setFilter({ ...filter, timeframe: val });

        if (val === "CUSTOM") {
            setIsModalOpen(true);
        }
    };

    return (
        // Container: bg-white -> bg-card, border-zinc-200 -> border-border
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-card p-6  border border-border shadow-glow transition-colors duration-500">

            {/* TIMEFRAME */}
            <div className="flex flex-col gap-2">
                {/* Label: text-zinc-500 -> text-text-muted */}
                <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                    Report Type
                </label>

                {/* Select: Added bg-bg, text-text, and updated focus rings to primary */}
                <select
                    value={filter.timeframe}
                    onChange={(e) => handleTimeframeChange(e.target.value)}
                    className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                >
                    <option value="DAY">🌅 Daily Daybook</option>
                    <option value="WEEK">📅 Weekly Summary</option>
                    <option value="MONTH">📊 Monthly Audit</option>
                    <option value="YEAR">🏛️ Annual Statement</option>
                    <option value="CUSTOM">⚙️ Custom Range</option>
                </select>
            </div>

            {/* TYPE */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                    Transaction Type
                </label>

                <select
                    value={filter.type}
                    onChange={(e) =>
                        setFilter({ ...filter, type: e.target.value })
                    }
                    className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                >
                    <option value="ALL">All Cashflow</option>
                    <option value="INCOME">Income Only</option>
                    <option value="EXPENSE">Expenses Only</option>
                </select>
            </div>

            {/* ACCOUNT */}
            <div className="flex flex-col gap-2 lg:col-span-1">
                <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                    Account Head
                </label>

                <select
                    value={filter.accountId}
                    onChange={(e) =>
                        setFilter({ ...filter, accountId: e.target.value })
                    }
                    className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                >
                    <option value="ALL">All Account Heads</option>
                    {accounts.map((acc: any) => (
                        <option key={acc._id} value={acc._id}>
                            {acc.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* FORMAT */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                    Format
                </label>

                <select
                    value={filter.format}
                    onChange={(e) =>
                        setFilter({ ...filter, format: e.target.value })
                    }
                    className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                >
                    <option value="PDF">PDF</option>
                    <option value="EXCEL">Excel</option>
                </select>
            </div>
        </div>
    );
}