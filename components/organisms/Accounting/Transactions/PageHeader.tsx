"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AddTransactionModal } from "../modals/modals/AddTransactionModal";

const PageHeader = ({ accounts }: { accounts: any[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8 transition-colors duration-500">

                {/* TITLE */}
                <div>
                    {/* Typography: Updated text-zinc-900 -> text-text */}
                    <h1 className="text-2xl font-black text-text tracking-tighter">
                        Finance & Ledger
                    </h1>
                    
                    {/* Subtitle: Updated text-zinc-500 -> text-text-muted */}
                    <p className="text-sm text-text-muted font-medium mt-0.5">
                        Professional cashflow management & reporting system
                    </p>
                </div>

                {/* ACTION */}
                <div className="flex gap-3">
                    {/* Button: Replaced hardcoded zinc/white classes with your utility */}
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary font-black px-6 h-10"
                    >
                        + New Transaction
                    </Button>
                </div>
            </div>

            {/* MODAL */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                accounts={accounts}
            />
        </>
    );
};

export default PageHeader;