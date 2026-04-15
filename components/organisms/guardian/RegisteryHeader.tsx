"use client"
import Guardian from '@/models/Guardian'
import React, { useState } from 'react'
import { AddGuardianFormModal } from './AddGuardianFormModal'
import { Button } from '@/components/atoms/Button'



export default function RegistryHeader() {
    const [viewGuardianModal, setViewGuardianModal] = useState(false)
    const onClose = () => setViewGuardianModal(false)
    return (
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-200">
            {viewGuardianModal && <AddGuardianFormModal isOpen={viewGuardianModal} onClose={onClose} />}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl border border-blue-100">
                    🤝
                </div>
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Guardian Registry</h1>
                    <p className="text-sm text-zinc-500 font-medium">Manage family vetting, background checks, and child placements.</p>
                </div>
            </div>
                <Button onClick={()=>setViewGuardianModal(true)} className="bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg text-white font-bold py-2.5 px-6 rounded-xl transition-all">
                    + Register Family
                </Button>
        </div>
    );
}