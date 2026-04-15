"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AddTransactionModal } from "../modals/modals/AddTransactionModal";

const PageHeader = ({ accounts }: { accounts: any[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-6">

                {/* TITLE */}
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tighter">
                        Finance & Ledger
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium">
                        Professional cashflow management & reporting system
                    </p>
                </div>

                {/* ACTION */}
                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-6 h-10"
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