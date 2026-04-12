import { Button } from '@/components/atoms/Button';
import React from 'react'

const ReportCenterModal:React.FC<{filter: any, setFilter: (filter: any) => void, setIsModalOpen: (isOpen: boolean) => void }> = ({ filter, setFilter, setIsModalOpen }) => {
    return (
        <div> <div className="fixed text-zinc-500 inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-zinc-900 tracking-tighter">Select Custom Range</h3>
                    <p className="text-xs text-zinc-500 font-medium">Choose the start and end dates for your audit.</p>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="cmd-label">Start Date</label>
                        <input
                            type="date"
                            className="cmd-input"
                            value={filter.startDate}
                            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="cmd-label">End Date</label>
                        <input
                            type="date"
                            className="cmd-input"
                            value={filter.endDate}
                            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Button variant="ghost" className="flex-1 font-bold" onClick={() => {
                        setIsModalOpen(false);
                        if (!filter.startDate) setFilter({ ...filter, timeframe: 'MONTH' }); // Reset if cancelled
                    }}>
                        Cancel
                    </Button>
                    <Button className="flex-1 bg-zinc-900 text-white font-bold" onClick={() => setIsModalOpen(false)}>
                        Apply Range
                    </Button>
                </div>
            </div>
        </div></div>
    )
}

export default ReportCenterModal