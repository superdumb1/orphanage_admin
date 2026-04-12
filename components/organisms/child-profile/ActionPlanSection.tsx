"use client";
import React, { useState } from 'react';
import { Button } from "@/components/atoms/Button";
import { ActionPlanList } from './ActionPlanList';
import { AddActionItemModal } from './AddActionModal';

export const ActionPlanSection = ({ 
    childId, 
    serializedTasks 
}: { 
    childId: string, 
    serializedTasks: any[] 
}) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">Needs & Action Plan</h3>
                <Button 
                    onClick={() => setModalOpen(true)} 
                    className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-300 text-xs font-bold py-1 px-4 h-8"
                >
                    + Log Need
                </Button>
            </div>

            <ActionPlanList tasks={serializedTasks} />

            <AddActionItemModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                childId={childId} 
            />
        </div>
    );
};