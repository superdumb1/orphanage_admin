"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { FormField } from "../../molecules/FormField";
import { SelectField } from "../../molecules/SelectField";
import { Button } from "../../atoms/Button";
import { createChild, updateChild } from "@/app/actions/child";
import { ImageUploadField } from "../../molecules/ImageUploadField";
import { KnownRelatives } from "../../organisms/child/KnownRelatives";
import {
    Baby,
    HeartPulse,
    History,
    GraduationCap,
    Users,
    FolderLock,
    Plus,
    FileText,
    Trash2,
    Image as ImageIcon
} from "lucide-react";

type FormState = {
    error: string | null;
    success?: boolean;
};

const initialState: FormState = {
    error: null
};

export const ChildForm = ({ initialData, closeModal }: { initialData?: any, closeModal?: () => void }) => {
    const actionToUse = initialData ? updateChild : createChild;
    const [state, formAction, isPending] = useActionState(actionToUse as any, initialState);

    const dob = initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '';
    const adminDate = initialData?.admissionDate
        ? new Date(initialData.admissionDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    const bTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(v => ({ label: v, value: v }));

    const arrivalOpts = [
        { label: 'Police Rescue', value: 'POLICE_RESCUE' },
        { label: 'Abandoned', value: 'ABANDONED' },
        { label: 'Family Surrender', value: 'FAMILY_SURRENDER' },
        { label: 'Hospital Referral', value: 'HOSPITAL_REFERRAL' },
        { label: 'Other', value: 'OTHER' }
    ];

    useEffect(() => {
        if (state?.success && closeModal) closeModal();
    }, [state?.success, closeModal]);

    return (
        <form
            action={formAction}
            className="flex flex-col gap-10 mx-auto lg:w-[72dvw] animate-in fade-in duration-500"
        >
            {initialData && <input type="hidden" name="_id" value={initialData._id} />}

            {/* ERROR ALERT */}
            {state?.error && (
                <div className="p-5 bg-danger/10 text-danger font-black rounded-2xl border border-danger/20 text-[10px] uppercase tracking-widest animate-in zoom-in-95">
                    ⚠ System Fault: {state.error}
                </div>
            )}

            {/* 01. CHILD IDENTITY PROTOCOL */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                    <Baby className="text-primary w-5 h-5" />
                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">01. Identity Parameters</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start bg-card p-6 md:p-8 rounded-dashboard border border-border shadow-sm">
                    <div className="flex-shrink-0">
                        <ImageUploadField defaultValue={initialData?.profileImageUrl} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <FormField label="First Name" name="firstName" required defaultValue={initialData?.firstName} />
                        <FormField label="Last Name" name="lastName" required defaultValue={initialData?.lastName} />

                        <SelectField
                            label="Gender"
                            name="gender"
                            required
                            defaultValue={initialData?.gender}
                            options={[
                                { label: 'Male', value: 'MALE' },
                                { label: 'Female', value: 'FEMALE' },
                                { label: 'Other', value: 'OTHER' }
                            ]}
                        />

                        <SelectField
                            label="System Status"
                            name="status"
                            required
                            defaultValue={initialData?.status || 'IN_CARE'}
                            options={[
                                { label: 'In Care', value: 'IN_CARE' },
                                { label: 'Fostered', value: 'FOSTERED' },
                                { label: 'Adopted', value: 'ADOPTED' },
                                { label: 'Reunited', value: 'REUNITED' },
                                { label: 'Graduated', value: 'GRADUATED' }
                            ]}
                        />
                        <FormField label="Date of Birth" name="dateOfBirth" type="date" required defaultValue={dob} className="bg-bg border-border/40" />
                        <FormField label="Admission Date" name="admissionDate" type="date" required defaultValue={adminDate} className="bg-bg border-border/40" />
                    </div>
                </div>
            </div>

            {/* 02. VITAL STATISTICS & HEALTH DATA */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-danger/80 pl-4">
                    <HeartPulse className="text-danger/80 w-5 h-5" />
                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">02. Vitals & Medical</h3>
                </div>

                <div className="bg-shaded/30 p-8 rounded-dashboard border border-border/50 shadow-inner flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField label="Blood Type" name="bloodType" defaultValue={initialData?.bloodType} options={bTypes} className="bg-bg" />
                        <FormField label="Known Allergies" name="allergies" defaultValue={initialData?.allergies} className="bg-bg" />
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <FormField label="Full Medical Synopsis" name="medicalNotes" defaultValue={initialData?.medicalNotes} className="bg-bg" />
                    </div>
                </div>
            </div>

            {/* 03. BACKGROUND & EDUCATION (2-COLUMN GRID) */}
            {/* ARRIVAL */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pl-4">
                    <History className="text-primary w-5 h-5 opacity-70" />
                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">03. Arrival Protocol</h3>
                </div>
                <div className="flex flex-col gap-6 bg-card p-6 rounded-dashboard border border-border h-full">
                    <SelectField label="Arrival Category" name="arrivalCategory" required defaultValue={initialData?.arrivalCategory || 'OTHER'} options={arrivalOpts} />
                    <FormField label="Arrival Details / Context" name="arrivalDetails" defaultValue={initialData?.arrivalDetails} />
                </div>

                {/* EDUCATION */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pl-4">
                        <GraduationCap className="text-primary w-5 h-5 opacity-70" />
                        <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">04. Academic Registry</h3>
                    </div>
                    <div className="flex  gap-6 bg-card p-6 rounded-dashboard border border-border h-full">
                        <FormField label="School Name" name="schoolName" defaultValue={initialData?.schoolName} />
                        <FormField label="Grade Level" name="gradeLevel" defaultValue={initialData?.gradeLevel} />
                    </div>
                </div>
            </div>

            {/* 05. KNOWN RELATIVES */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pl-4">
                    <Users className="text-primary w-5 h-5 opacity-70" />
                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">05. Social Audit Trail</h3>
                </div>
                {/* Note: Ensure <KnownRelatives /> is styled nicely inside its own component! */}
                <KnownRelatives initialRelatives={initialData?.knownRelatives || []} />
            </div>

            {/* 06. DIGITAL VAULT */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pl-4 border-l-4 border-primary">
                    <FolderLock className="text-primary w-5 h-5" />
                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">06. Digital Vault</h3>
                </div>

                <DocumentVaultUpload existingDocs={initialData?.documents} />
                <PhotoGalleryUpload existingPhotos={initialData?.gallery} />
            </div>

            {/* ACTIONS FOOTER */}
            <div className="flex justify-end items-center gap-6 pt-10 border-t border-border/50 mt-4">
                {closeModal && (
                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={isPending}
                        className="text-[10px] font-black text-text-muted hover:text-text uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                )}

                <Button type="submit" disabled={isPending} className="btn-primary min-w-[200px] h-14 shadow-glow">
                    {isPending ? "Syncing Dossier..." : (initialData ? "Update" : "Save")}
                </Button>
            </div>
        </form>
    );
};

/* ================= THEMED VAULT COMPONENTS ================= */

export const DocumentVaultUpload = ({ existingDocs = [] }: { existingDocs?: string[] }) => {
    const [files, setFiles] = useState<File[]>([]);
    const ref = useRef<HTMLInputElement>(null);

    const sync = (f: File[]) => {
        const dt = new DataTransfer();
        f.forEach(file => dt.items.add(file));
        if (ref.current) ref.current.files = dt.files;
    };

    return (
        <div className="p-8 bg-shaded/40 border border-border rounded-dashboard flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text uppercase tracking-widest">Legal Docs</span>
                    <span className="text-[8px] text-text-muted uppercase font-bold tracking-tighter opacity-50">PDF / DOCX ONLY</span>
                </div>
                <label className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all active:scale-95">
                    <Plus size={18} />
                    <input
                        ref={ref}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            const newFiles = Array.from(e.target.files || []);
                            const combined = [...files, ...newFiles];
                            setFiles(combined);
                            sync(combined);
                        }}
                    />
                </label>
            </div>

            {files.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-border/50 rounded-xl">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">No Documents Uploaded</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-bg border border-border/50 rounded-xl animate-in slide-in-from-left-2 group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileText size={14} className="text-primary shrink-0" />
                                <span className="text-[10px] font-bold truncate text-text-muted group-hover:text-text transition-colors">{f.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = files.filter((_, idx) => idx !== i);
                                    setFiles(updated);
                                    sync(updated);
                                }}
                                className="text-danger opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const PhotoGalleryUpload = ({ existingPhotos = [] }: { existingPhotos?: string[] }) => {
    const [imgs, setImgs] = useState<{ file: File, url: string }[]>([]);
    const ref = useRef<HTMLInputElement>(null);

    const sync = (arr: any[]) => {
        const dt = new DataTransfer();
        arr.forEach(i => dt.items.add(i.file));
        if (ref.current) ref.current.files = dt.files;
    };

    return (
        <div className="p-8 bg-shaded/40 border border-border rounded-dashboard flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text uppercase tracking-widest">Snapshot Gallery</span>
                    <span className="text-[8px] text-text-muted uppercase font-bold tracking-tighter opacity-50">Visual Assets</span>
                </div>
                <label className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all active:scale-95">
                    <ImageIcon size={18} />
                    <input
                        ref={ref}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const mapped = files.map(f => ({
                                file: f,
                                url: URL.createObjectURL(f)
                            }));
                            const combined = [...imgs, ...mapped];
                            setImgs(combined);
                            sync(combined);
                        }}
                    />
                </label>
            </div>

            {imgs.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-border/50 rounded-xl">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">No Photos Uploaded</p>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {imgs.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 shrink-0 group animate-in zoom-in-95">
                            <img src={img.url} className="w-full h-full object-cover rounded-xl border border-border group-hover:opacity-30 transition-all" />
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = imgs.filter((_, idx) => idx !== i);
                                    setImgs(updated);
                                    sync(updated);
                                }}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-danger transition-all bg-black/20 rounded-xl"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};