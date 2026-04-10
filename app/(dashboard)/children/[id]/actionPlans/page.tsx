"use client";
import React from 'react';

const priorityColors = {
    LOW: "bg-zinc-100 text-zinc-600",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700 animate-pulse"
};

export const ActionPlanList = ({ tasks }: { tasks: any[] }) => {
    return (
        <div className="flex flex-col gap-3">
            {tasks.map((task) => (
                <div key={task._id} className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                            {task.priority}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {task.category}
                        </span>
                    </div>
                    <h4 className="font-bold text-zinc-900 text-sm">{task.title}</h4>
                    {task.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{task.description}</p>}
                    
                    <div className="mt-4 pt-3 border-t border-zinc-50 flex justify-between items-center">
                        <div className="text-[10px] text-zinc-400 font-medium">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                        </div>
                        <div className={`text-[10px] font-bold px-2 py-1 rounded ${task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>
                            {task.status}
                        </div>
                    </div>
                </div>
            ))}
            {tasks.length === 0 && (
                <div className="text-center py-10 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
                    <p className="text-xs text-zinc-400 font-medium italic">No active needs logged for this child.</p>
                </div>
            )}
        </div>
    );
};