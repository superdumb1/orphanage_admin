"use client";

import React, { useActionState, useEffect, useState, useRef } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { createChild, updateChild } from "@/app/actions/child";
import { ImageUploadField } from "@/components/molecules/ImageUploadField";
import { KnownRelatives } from "@/components/organisms/child/KnownRelatives";
import { DocumentVaultUpload, PhotoGalleryUpload } from "./UploadVault";
import ArrivalProtocol from "./ArrivalProtocol";
import {
    Baby,
    HeartPulse,
    GraduationCap,
    Users,
    FolderLock,
    AlertCircle
} from "lucide-react";

export const ChildForm = ({ initialData, closeModal }: { initialData?: any, closeModal?: () => void }) => {
    const actionToUse = initialData ? updateChild : createChild;
    const [state, formAction, isPending] = useActionState(actionToUse as any, { error: null, success: false });
    const formRef = useRef<HTMLFormElement>(null);

    const [arrivalType, setArrivalType] = useState(initialData?.arrivalCategory || 'OTHER');

    const dob = initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '';
    const adminDate = initialData?.admissionDate
        ? new Date(initialData.admissionDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (state?.success && closeModal) closeModal();
    }, [state?.success, closeModal]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const target = e.target as HTMLElement;

            // Skip jump for textareas and submit buttons
            if (target.tagName === "TEXTAREA" || target.getAttribute("type") === "submit") return;

            e.preventDefault();

            const form = formRef.current;
            if (!form) return;

            const focusableElements = Array.from(form.querySelectorAll<HTMLElement>(
                'input:not([type="hidden"]):not([disabled]), ' +
                'button:not([disabled]):not([type="button"]), ' + 
                'select:not([disabled]), ' +
                'textarea:not([disabled]), ' +
                '[role="combobox"], ' +
                '[tabindex="0"]'
            )).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 || el.tagName === "SELECT";
            });

            const currentIndex = focusableElements.indexOf(target);

            if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
                let nextElement = focusableElements[currentIndex + 1];

                // Jump to the visible button trigger if the next element is a hidden select
                if (nextElement.tagName === "SELECT" || nextElement.offsetParent === null) {
                    const parent = nextElement.parentElement;
                    const visibleTrigger = parent?.querySelector('button, [role="combobox"]') as HTMLElement;
                    if (visibleTrigger) nextElement = visibleTrigger;
                }

                nextElement.focus();
            }
        }
    };

    return (
        <form 
            ref={formRef} 
            action={formAction} 
            onKeyDown={handleKeyDown} 
            className="flex flex-col gap-12 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500"
        >
            {initialData && <input type="hidden" name="_id" value={initialData._id} />}

            {/* 01. IDENTITY SECTION */}
            <Section icon={<Baby size={18} />} title="01. Identity Parameters">
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
                    <div className="flex flex-col items-center gap-3">
                        <ImageUploadField defaultValue={initialData?.profileImageUrl} />
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Profile Portrait</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="First Name" name="firstName" required defaultValue={initialData?.firstName} />
                        <FormField label="Last Name" name="lastName" required defaultValue={initialData?.lastName} />
                        <SelectField
                            label="Gender"
                            name="gender"
                            required
                            defaultValue={initialData?.gender || ""}
                            options={[
                                { label: 'Select Gender', value: '', disabled: true },
                                { label: 'Male', value: 'MALE' }, 
                                { label: 'Female', value: 'FEMALE' }, 
                                { label: 'Other', value: 'OTHER' }
                            ]}
                        />
                        <SelectField
                            label="Current Status"
                            name="status"
                            required
                            defaultValue={initialData?.status || ""}
                            options={[
                                { label: 'Select Status', value: '', disabled: true },
                                { label: 'In Care', value: 'IN_CARE' }, 
                                { label: 'Fostered', value: 'FOSTERED' }, 
                                { label: 'Adopted', value: 'ADOPTED' },
                                { label: 'Reunited', value: 'REUNITED' }
                            ]}
                        />
                        <FormField label="Date of Birth" name="dateOfBirth" type="date" required defaultValue={dob} />
                        <FormField label="Admission Date" name="admissionDate" type="date" required defaultValue={adminDate} />
                    </div>
                </div>
            </Section>

            {/* 03. ARRIVAL PROTOCOL */}
            <ArrivalProtocol initialData={initialData} arrivalType={arrivalType} setArrivalType={setArrivalType} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 04. EDUCATION */}
                <Section icon={<GraduationCap size={18} />} title="04. Education">
                    <div className="space-y-6">
                        <FormField label="Current School" name="schoolName" defaultValue={initialData?.schoolName} />
                        <FormField label="Current Grade" name="gradeLevel" defaultValue={initialData?.gradeLevel} />
                    </div>
                </Section>

                {/* 02. MEDICAL */}
                <Section icon={<HeartPulse size={18} className="text-red-500" />} title="02. Health & Vitals">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SelectField
                            label="Blood Type"
                            name="bloodType"
                            defaultValue={initialData?.bloodType || ""}
                            options={[
                                { label: 'Select', value: '', disabled: true },
                                ...['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(v => ({ label: v, value: v }))
                            ]}
                        />
                        <div className="md:col-span-2">
                            <FormField label="Known Allergies" name="allergies" defaultValue={initialData?.allergies} placeholder="e.g. Peanuts, Dairy" />
                        </div>
                        <div className="md:col-span-3">
                            <FormField label="Medical Synopsis" name="medicalNotes" defaultValue={initialData?.medicalNotes} placeholder="Vaccination history..." />
                        </div>
                    </div>
                </Section>
            </div>

            <Section icon={<Users size={18} />} title="05. Known Relatives">
                <KnownRelatives initialRelatives={initialData?.knownRelatives || []} />
            </Section>

            <Section icon={<FolderLock size={18} />} title="06. Digital Vault">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DocumentVaultUpload existingDocs={initialData?.documents} />
                    <PhotoGalleryUpload existingPhotos={initialData?.gallery} />
                </div>
            </Section>

            {state?.error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle size={18} />
                    <span>Action Failed: {state.error}</span>
                </div>
            )}

            <div className="sticky bottom-6 bg-white/80 backdrop-blur-xl border border-zinc-200 p-4 rounded-3xl shadow-2xl flex justify-end items-center gap-4 z-50">
                {closeModal && (
                    <button type="button" onClick={closeModal} className="px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-800 transition-colors">
                        Discard
                    </button>
                )}
                <Button type="submit" disabled={isPending} className="bg-zinc-900 text-white px-12 h-14 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    {isPending ? "Syncing..." : (initialData ? "Update Record" : "Finalize Admission")}
                </Button>
            </div>
        </form>
    );
};

export const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 shadow-sm">
                {icon}
            </div>
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">{title}</h2>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            {children}
        </div>
    </div>
);