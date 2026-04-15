"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";

const ReportCenterModal: React.FC<{
    filter: any;
    setFilter: (filter: any) => void;
    setIsModalOpen: (isOpen: boolean) => void;
}> = ({ filter, setFilter, setIsModalOpen }) => {

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in zoom-in-95">

                {/* HEADER */}
                <div className="p-6 border-b bg-zinc-50 shrink-0">
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                        Select Custom Range
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                        Choose start and end dates for report generation
                    </p>
                </div>

                {/* BODY */}
                <div className="p-6 flex flex-col gap-5">

                    {/* START DATE */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-zinc-500">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={filter.startDate}
                            onChange={(e) =>
                                setFilter({ ...filter, startDate: e.target.value })
                            }
                            className="w-full p-3 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
                        />
                    </div>

                    {/* END DATE */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-zinc-500">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={filter.endDate}
                            onChange={(e) =>
                                setFilter({ ...filter, endDate: e.target.value })
                            }
                            className="w-full p-3 text-sm border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-6 border-t flex justify-end gap-3 bg-white">

                    <Button
                        variant="ghost"
                        className="px-6 font-bold text-zinc-500"
                        onClick={() => {
                            setIsModalOpen(false);

                            if (!filter.startDate) {
                                setFilter({ ...filter, timeframe: "MONTH" });
                            }
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-8"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Apply Range
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default ReportCenterModal;