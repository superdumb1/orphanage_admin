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

            {/* Changed bg-white to bg-card and added shadow-glow */}
            <div className="flex justify-between items-center bg-card p-6 rounded-dashboard shadow-glow border border-border transition-colors duration-500">

                {/* LEFT TEXT */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-text tracking-tight">
                        Employees
                    </h1>
                    <p className="text-sm text-text-muted font-medium">
                        Manage workforce, roles, payroll & compliance
                    </p>
                </div>

                {/* ACTION */}
                {/* Changed manual zinc-900 to your btn-primary utility */}
                <Button
                    variant="primary"
                    onClick={() => setViewAddStaffModal(true)}
                    className="btn-primary"
                >
                    + Add Employee
                </Button>
            </div>
        </>
    );
};

export default StaffHomeTop;