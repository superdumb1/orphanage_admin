"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { createStaff, updateStaff } from "@/app/actions/staff";
import SalaryDropdownForm from "./staffs/staffFormAccecerios/SalaryDropdownForm";
import BasicInfoFields from "./staffs/staffFormAccecerios/BasicInfoFeilds";
import { EmploymentDetails } from "./staffs/staffFormAccecerios/EmployMentDetails";
import SSFPFcontri from "./staffs/staffFormAccecerios/SSFPFcontri";
import BankDetails from "./staffs/staffFormAccecerios/BankDetails";

type FormState = { error: string | null; success?: boolean };
const initialState: FormState = { error: null };

export const StaffForm = ({ initialData, onClose }: { initialData?: any, onClose?: () => void }) => {
    const [activeSection, setActiveSection] = useState("basic");
    const actionToUse = initialData ? updateStaff : createStaff;
    const [state, formAction, isPending] = useActionState(actionToUse, initialState);
    useEffect(() => {
        if (state?.success && onClose) {
            onClose();
        }
    }, [state?.success, onClose]);

    const [liveSalary, setLiveSalary] = useState(() => {
        if (!initialData || !initialData.salary) return { gross: 0, deduction: 0, net: 0 };
        // ... (keep your existing liveSalary initialization code here)
        const s = initialData.salary;
        const a = s.allowances || {};
        const basic = s.basicSalary || 0;
        const grade = s.grade || 0;
        const da = s.dearnessAllowance || 0;

        const allowances = (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) + (a.food || 0) + (a.communication || 0) + (a.other || 0);
        const ssfPercent = initialData.ssf?.employeeContribution || 0;
        const insurance = s.insurancePremium || 0;

        const gross = basic + grade + da + allowances;
        const ssfDeduction = (basic + grade + da) * (ssfPercent / 100);
        const totalDeductions = ssfDeduction + insurance;

        return { gross, deduction: totalDeductions, net: gross - totalDeductions };
    });

    const sectionView = (id: string) => setActiveSection(activeSection === id ? "" : id);

    const SectionHeader = ({ title, id, label }: { title: string, id: string, label: string }) => (
        <button type="button" onClick={() => sectionView(id)} className={`w-full text-left p-4 border-b flex justify-between items-center font-bold ${activeSection === id ? 'bg-zinc-50 text-red-600' : 'text-zinc-700'}`}>
            <span>{title} <small className="font-normal text-zinc-400">({label})</small></span>
            <span>{activeSection === id ? '▼' : '▶'}</span>
        </button>
    );

    const calculateLiveSalary = (e: React.FormEvent<HTMLFormElement>) => {
        // ... (keep your existing calculateLiveSalary code here)
        const formData = new FormData(e.currentTarget);
        const basic = Number(formData.get("basicSalary")) || 0;
        const grade = Number(formData.get("grade")) || 0;
        const da = Number(formData.get("dearnessAllowance")) || 0;

        const allowances = ["houseRent", "medical", "transport", "food", "communication", "other"]
            .reduce((sum, field) => sum + (Number(formData.get(field)) || 0), 0);

        const ssfPercent = Number(formData.get("ssf.employeeContribution")) || 0;
        const insurance = Number(formData.get("insurancePremium")) || 0;

        const gross = basic + grade + da + allowances;
        const ssfDeduction = (basic + grade + da) * (ssfPercent / 100);
        const totalDeductions = ssfDeduction + insurance;

        setLiveSalary({ gross, deduction: totalDeductions, net: gross - totalDeductions });
    };

    // ✨ THE FIX: Smart Error Interceptor
    // If HTML5 validation fails on a hidden field, this opens the correct tab!
    const handleFormError = (e: React.FormEvent<HTMLFormElement>) => {
        const target = e.target as HTMLInputElement;
        const fieldName = target.name;

        if (!fieldName) return;

        // Route the error to the correct tab based on the input's name attribute
        if (fieldName.startsWith("bank")) {
            setActiveSection("bank_details");
        } else if (fieldName.startsWith("ssf")) {
            setActiveSection("ssf_pf");
        } else if (["department", "designation", "employmentType", "joinDate"].includes(fieldName)) {
            setActiveSection("job");
        } else if (["basicSalary", "grade", "dearnessAllowance", "festivalBonusMonths", "insurancePremium"].includes(fieldName)) {
            setActiveSection("salary");
        } else {
            setActiveSection("basic");
        }
    };

    return (
        // Add the onInvalid={handleFormError} listener right here!
        <form
            action={formAction}
            onChange={calculateLiveSalary}
            onInvalid={handleFormError}
            className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden max-w-4xl relative pb-24"
        >
            {initialData && <input type="hidden" name="_id" value={initialData._id} />}
            {state?.error && (
                <div className="p-4 m-4 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200">
                    ⚠️ {state.error}
                </div>
            )}

            <SectionHeader title="Basic Information" id="basic" label="आधारभूत जानकारी" />
            <div className={activeSection === "basic" ? "block" : "hidden"}><BasicInfoFields initialData={initialData} /></div>

            <SectionHeader title="Employment Details" id="job" label="रोजगारी विवरण" />
            <div className={activeSection === "job" ? "block" : "hidden"}><EmploymentDetails initialData={initialData} /></div>

            <SectionHeader title="Salary Structure" id="salary" label="तलब संरचना" />
            <div className={activeSection === "salary" ? "block" : "hidden"}><SalaryDropdownForm initialData={initialData} /></div>

            <SectionHeader title="SSF/PF Contributions" id="ssf_pf" label="SSF/PF योगदान" />
            <div className={activeSection === "ssf_pf" ? "block" : "hidden"}><SSFPFcontri initialData={initialData} /></div>

            <SectionHeader title="Bank Details" id="bank_details" label="बैंक विवरण" />
            <div className={activeSection === "bank_details" ? "block" : "hidden"}><BankDetails initialData={initialData} /></div>

            {/* LIVE SALARY DASHBOARD */}
            <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 text-white p-4 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
                {/* ... Keep your dashboard UI here ... */}
                <div className="flex gap-8">
                    <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Gross Salary</p>
                        <p className="font-medium">Rs. {liveSalary.gross.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-red-400 uppercase font-bold tracking-widest">- Deductions</p>
                        <p className="font-medium text-red-300">Rs. {liveSalary.deduction.toLocaleString()}</p>
                    </div>
                    <div className="pl-6 border-l border-zinc-700">
                        <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Take-Home (Net)</p>
                        <p className="text-xl font-black text-emerald-400">Rs. {liveSalary.net.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* ✨ Add Cancel Button for Modal */}
                    {onClose && (
                        <button type="button" onClick={onClose} disabled={isPending} className="text-zinc-300 hover:text-white text-sm font-bold px-4 transition-colors">
                            Cancel
                        </button>
                    )}
                    <Button type="submit" disabled={isPending} className="bg-white text-zinc-900 hover:bg-zinc-200 shadow-md font-bold disabled:opacity-50">
                        {isPending ? "Saving..." : (initialData ? "Update Employee" : "Save Employee")}
                    </Button>
                </div>
            </div>
        </form>
    );
};