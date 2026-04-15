"use client"
import { Button } from '@/components/atoms/Button'
import React, { useState } from 'react'
import { AddStaffModal } from '../AddStaffModal';

const StaffHomeTop = ({ }) => {
    const [viewAddStaffModal, setViewAddStaffModal] = useState(false);
    const onClose = () => setViewAddStaffModal(false);
    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Employees</h1>
                <p className="text-sm text-zinc-500">Manage workforce, roles, and payroll</p>
            </div>
            <Button variant="primary" onClick={() => (setViewAddStaffModal(true))} className="shadow-sm">+ Add Employee</Button>
            <AddStaffModal isOpen={viewAddStaffModal} onClose={onClose} />
        </div>
    )
}

export default StaffHomeTop