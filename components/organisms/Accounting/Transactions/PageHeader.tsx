"use client"
import { Button } from '@/components/atoms/Button'
import React, { useState } from 'react'
import { AddTransactionModal } from '../modals/modals/AddTransactionModal'

const PageHeader = ({accounts}: {accounts: any[]}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
            <div className="mb-4">
                <h1 className="text-2xl font-black text-zinc-900 tracking-tighter">Finance & Ledger</h1>
                <p className="text-sm text-zinc-500 font-medium">Professional cashflow management & reporting.</p>
            </div>
            <div className="flex gap-3">
                <Button onClick={() => setIsModalOpen(true)} className="bg-zinc-900 h-10 text-xl text-white font-bold px-6 cursor-pointer" >+ New Transaction</Button>
            </div>
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                accounts={accounts}
            />
        </div>
    )
}

export default PageHeader