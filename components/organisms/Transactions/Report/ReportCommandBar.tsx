"use client";
import React from "react";

export default function ReportCommandBar({ filter, setFilter, accounts, onGenerate, setIsModalOpen }: any) {

    const handleTimeframeChange = (val: string) => {
        setFilter({ ...filter, timeframe: val });
        if (val === 'CUSTOM') setIsModalOpen(true);
    };

    return (
        <div className="text-zinc-900 flex flex-col lg:flex-row items-stretch lg:items-end gap-3 bg-zinc-50 p-4 rounded-[2rem] border border-zinc-100">
            <div className="flex-1 flex flex-col gap-1.5">
                <label className="cmd-label">Report Type</label>
                <select value={filter.timeframe} onChange={(e) => handleTimeframeChange(e.target.value)} className="cmd-input">
                    <option value="DAY">🌅 Daily Daybook</option>
                    <option value="WEEK">📅 Weekly Summary</option>
                    <option value="MONTH">📊 Monthly Audit</option>
                    <option value="YEAR">🏛️ Annual Statement</option>
                    <option value="CUSTOM">⚙️ Custom Range...</option>
                </select>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
                <label className="cmd-label">Transaction Type</label>
                <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })} className="cmd-input">
                    <option value="ALL">All Cashflow</option>
                    <option value="INCOME">Income Only</option>
                    <option value="EXPENSE">Expenses Only</option>
                </select>
            </div>

            <div className="flex-[1.2] flex flex-col gap-1.5">
                <label className="cmd-label">Specific Account</label>
                <select value={filter.accountId} onChange={(e) => setFilter({ ...filter, accountId: e.target.value })} className="cmd-input">
                    <option value="ALL">All Account Heads</option>
                    {accounts.map((acc: any) => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                </select>
            </div>

            <div className="w-full lg:w-32 flex flex-col gap-1.5">
                <label className="cmd-label">Format</label>
                <select value={filter.format} onChange={(e) => setFilter({ ...filter, format: e.target.value })} className="cmd-input">
                    <option value="PDF">PDF</option>
                    <option value="EXCEL">Excel</option>
                </select>
            </div>

        </div>
    );
}