"use client";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { FormField } from "../../molecules/FormField";
import { SelectField } from "../../molecules/SelectField";
import { Button } from "../../atoms/Button";
import { createChild, updateChild } from "@/app/actions/child";
import { ImageUploadField } from "../../molecules/ImageUploadField";
import { KnownRelatives } from "./KnownRelatives";

type FormState = {
    error: string | null;
    success?: boolean;
};

const initialState: FormState = {
    error: null
};

export const ChildForm = ({ initialData, onClose }: { initialData?: any, onClose?: () => void }) => {
    const actionToUse = initialData ? updateChild : createChild;
    const [state, formAction, isPending] = useActionState(actionToUse, initialState);

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
        if (state?.success && onClose) onClose();
    }, [state?.success, onClose]);

    return (
        <form
            action={formAction}
            className="bg-card text-text p-6 rounded-2xl border border-border shadow-glow flex flex-col gap-6 max-w-4xl"
        >
            {initialData && <input type="hidden" name="_id" value={initialData._id} />}

            {state?.error && (
                <div className="p-4 bg-danger/10 text-danger font-bold rounded-xl border border-danger/30">
                    ⚠️ {state.error}
                </div>
            )}

            <ChildFormTopSection initialData={initialData} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField label="Blood Type" name="bloodType" defaultValue={initialData?.bloodType} options={bTypes} />
                <FormField label="Date of Birth" name="dateOfBirth" type="date" required defaultValue={dob} />
                <FormField label="Admission Date" name="admissionDate" type="date" required defaultValue={adminDate} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="School Name" name="schoolName" defaultValue={initialData?.schoolName} />
                <FormField label="Grade Level" name="gradeLevel" defaultValue={initialData?.gradeLevel} />
                <FormField label="Allergies" name="allergies" defaultValue={initialData?.allergies} />
            </div>

            <KnownRelatives initialRelatives={initialData?.knownRelatives || []} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <SelectField label="Arrival Category" name="arrivalCategory" required defaultValue={initialData?.arrivalCategory || 'OTHER'} options={arrivalOpts} />
                <FormField label="Arrival Details" name="arrivalDetails" defaultValue={initialData?.arrivalDetails} />
            </div>

            <FormField label="Medical Notes" name="medicalNotes" defaultValue={initialData?.medicalNotes} />

            <div className="flex flex-col gap-6 pt-4 border-t border-border">
                <DocumentVaultUpload existingDocs={initialData?.documents} />
                <PhotoGalleryUpload existingPhotos={initialData?.gallery} />
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-border">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-5 py-2.5 text-sm font-bold text-text-muted bg-shaded hover:bg-border rounded-xl transition"
                    >
                        Cancel
                    </button>
                )}

                <Button type="submit" disabled={isPending} className="btn-primary">
                    {isPending ? "Saving..." : (initialData ? "Update Record" : "Save Child Record")}
                </Button>
            </div>
        </form>
    );
};

/* ================= TOP ================= */
const ChildFormTopSection = ({ initialData }: { initialData: any }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-border pb-6">
        <ImageUploadField defaultValue={initialData?.profileImageUrl} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
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
                label="Status"
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
        </div>
    </div>
);

/* ================= DOCUMENTS ================= */
export const DocumentVaultUpload = ({ existingDocs = [] }: { existingDocs?: string[] }) => {
    const [files, setFiles] = useState<File[]>([]);
    const ref = useRef<HTMLInputElement>(null);

    const sync = (f: File[]) => {
        const dt = new DataTransfer();
        f.forEach(file => dt.items.add(file));
        if (ref.current) ref.current.files = dt.files;
    };

    return (
        <div className="p-6 bg-shaded border border-border rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold">📄 Documents</h3>
                <label className="btn-primary cursor-pointer text-xs">
                    Upload
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

            <div className="grid md:grid-cols-3 gap-3">
                {files.map((f, i) => (
                    <div key={i} className="p-3 bg-card border border-border rounded-xl text-sm flex justify-between">
                        {f.name}
                        <button onClick={() => {
                            const updated = files.filter((_, idx) => idx !== i);
                            setFiles(updated);
                            sync(updated);
                        }}>✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ================= PHOTOS ================= */
export const PhotoGalleryUpload = ({ existingPhotos = [] }: { existingPhotos?: string[] }) => {
    const [imgs, setImgs] = useState<{ file: File, url: string }[]>([]);
    const ref = useRef<HTMLInputElement>(null);

    const sync = (arr: any[]) => {
        const dt = new DataTransfer();
        arr.forEach(i => dt.items.add(i.file));
        if (ref.current) ref.current.files = dt.files;
    };

    return (
        <div className="p-6 bg-shaded border border-border rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold">🖼️ Gallery</h3>
                <label className="btn-primary cursor-pointer text-xs">
                    Upload
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

            <div className="flex gap-4 overflow-x-auto">
                {imgs.map((img, i) => (
                    <div key={i} className="relative w-28 h-28">
                        <img src={img.url} className="w-full h-full object-cover rounded-xl border border-border" />
                        <button
                            onClick={() => {
                                const updated = imgs.filter((_, idx) => idx !== i);
                                setImgs(updated);
                                sync(updated);
                            }}
                            className="absolute top-0 right-0 bg-danger text-white rounded-full w-6 h-6"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};