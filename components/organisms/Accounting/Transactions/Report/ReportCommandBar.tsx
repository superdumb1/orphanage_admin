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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">

            {/* TIMEFRAME */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-zinc-500">
                    Report Type
                </label>

                <select
                    value={filter.timeframe}
                    onChange={(e) => handleTimeframeChange(e.target.value)}
                    className="w-full p-3 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
                >
                    <option value="DAY">🌅 Daily Daybook</option>
                    <option value="WEEK">📅 Weekly Summary</option>
                    <option value="MONTH">📊 Monthly Audit</option>
                    <option value="YEAR">🏛️ Annual Statement</option>
                    <option value="CUSTOM">⚙️ Custom Range</option>
                </select>
            </div>

            {/* TYPE */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-zinc-500">
                    Transaction Type
                </label>

                <select
                    value={filter.type}
                    onChange={(e) =>
                        setFilter({ ...filter, type: e.target.value })
                    }
                    className="w-full p-3 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
                >
                    <option value="ALL">All Cashflow</option>
                    <option value="INCOME">Income Only</option>
                    <option value="EXPENSE">Expenses Only</option>
                </select>
            </div>

            {/* ACCOUNT */}
            <div className="flex flex-col gap-1.5 lg:col-span-1">
                <label className="text-[10px] uppercase font-black text-zinc-500">
                    Account Head
                </label>

                <select
                    value={filter.accountId}
                    onChange={(e) =>
                        setFilter({ ...filter, accountId: e.target.value })
                    }
                    className="w-full p-3 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
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
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-zinc-500">
                    Format
                </label>

                <select
                    value={filter.format}
                    onChange={(e) =>
                        setFilter({ ...filter, format: e.target.value })
                    }
                    className="w-full p-3 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
                >
                    <option value="PDF">PDF</option>
                    <option value="EXCEL">Excel</option>
                </select>
            </div>
        </div>
    );
}