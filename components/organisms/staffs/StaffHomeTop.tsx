"use client";

import { Button } from "@/components/atoms/Button";
import React, { useState } from "react";
import { AddStaffModal } from "../AddStaffModal";

const StaffHomeTop = () => {
    const [viewAddStaffModal, setViewAddStaffModal] = useState(false);

    return (
        <>
            <AddStaffModal
                isOpen={viewAddStaffModal}
                onClose={() => setViewAddStaffModal(false)}
            />

            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">

                {/* LEFT TEXT */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                        Employees
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium">
                        Manage workforce, roles, payroll & compliance
                    </p>
                </div>

                {/* ACTION */}
                <Button
                    variant="primary"
                    onClick={() => setViewAddStaffModal(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                    + Add Employee
                </Button>
            </div>
        </>
    );
};

export default StaffHomeTop;