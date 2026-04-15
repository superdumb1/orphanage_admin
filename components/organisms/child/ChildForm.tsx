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

// ==========================================
// 1. MAIN FORM (ORCHESTRATOR)
// ==========================================
export const ChildForm = ({ initialData, onClose }: { initialData?: any, onClose?: () => void }) => {
    const actionToUse = initialData ? updateChild : createChild;
    const [state, formAction, isPending] = useActionState(actionToUse, initialState);

    const dob = initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '';
    const adminDate = initialData?.admissionDate ? new Date(initialData.admissionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const bTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(v => ({ label: v, value: v }));
    const arrivalOpts = [
        { label: 'Police Rescue', value: 'POLICE_RESCUE' }, { label: 'Abandoned', value: 'ABANDONED' },
        { label: 'Family Surrender', value: 'FAMILY_SURRENDER' }, { label: 'Hospital Referral', value: 'HOSPITAL_REFERRAL' },
        { label: 'Other', value: 'OTHER' }
    ];

    useEffect(() => {
        if (state?.success && onClose) {
            onClose();
        }
    }, [state?.success, onClose]);

    return (
        <form action={formAction} className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-6 max-w-4xl">
            {initialData && <input type="hidden" name="_id" value={initialData._id} />}

            {state?.error && (
                <div className="p-4 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200">
                    ⚠️ {state.error}
                </div>
            )}

            <ChildFormTopSection initialData={initialData} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField label="Blood Type" name="bloodType" id="bloodType" defaultValue={initialData?.bloodType} options={bTypes} />
                <FormField label="Date of Birth" name="dateOfBirth" id="dob" type="date" required defaultValue={dob} />
                <FormField label="Admission Date" name="admissionDate" id="adminDate" required defaultValue={adminDate} type="date" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="School Name" name="schoolName" id="school" defaultValue={initialData?.schoolName} />
                <FormField label="Grade Level" name="gradeLevel" id="grade" defaultValue={initialData?.gradeLevel} />
                <FormField label="Allergies" name="allergies" id="allergies" defaultValue={initialData?.allergies} placeholder="e.g. Peanuts" />
            </div>

            {/* 🚨 Fixed database property name from .relatives to .knownRelatives */}
            <KnownRelatives initialRelatives={initialData?.knownRelatives || []} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                <SelectField label="Arrival Category" name="arrivalCategory" id="arrivalCategory" required defaultValue={initialData?.arrivalCategory || 'OTHER'} options={arrivalOpts} />
                <FormField label="Arrival Story / Details" name="arrivalDetails" id="arrivalDetails" defaultValue={initialData?.arrivalDetails} placeholder="Brief summary of their background..." />
            </div>

            <FormField label="Medical Notes" name="medicalNotes" id="medicalNotes" defaultValue={initialData?.medicalNotes} />

            {/* 🚨 NEW FULL-WIDTH MEDIA COMPONENTS 🚨 */}
            <div className="flex flex-col gap-6 pt-4 border-t border-zinc-100">
                <DocumentVaultUpload existingDocs={initialData?.documents} />
                <PhotoGalleryUpload existingPhotos={initialData?.gallery} />
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-zinc-100">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-5 py-2.5 text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <Button type="submit" disabled={isPending} className="disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md px-8 py-2.5">
                    {isPending ? "Saving..." : (initialData ? "Update Record" : "Save Child Record")}
                </Button>
            </div>
        </form>
    );
};

// ==========================================
// 2. FORM FRAGMENTS (COLOCATED)
// ==========================================

const ChildFormTopSection = ({ initialData }: { initialData: any }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border-b border-zinc-100 pb-6">
            <ImageUploadField defaultValue={initialData?.profileImageUrl} />
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:col-span-2">
                <FormField label="First Name" name="firstName" id="firstName" required defaultValue={initialData?.firstName} />
                <FormField label="Last Name" name="lastName" id="lastName" required defaultValue={initialData?.lastName} />
                <SelectField
                    label="Gender"
                    name="gender"
                    id="gender"
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
                    id="status"
                    required
                    defaultValue={initialData?.status || 'IN_CARE'}
                    options={[
                        { label: 'In Care (आश्रममा)', value: 'IN_CARE' },
                        { label: 'Fostered (धर्मपुत्र/पुत्री)', value: 'FOSTERED' },
                        { label: 'Adopted (ग्रहण गरिएको)', value: 'ADOPTED' },
                        { label: 'Reunited with Family', value: 'REUNITED' },
                        { label: 'Graduated / Independent', value: 'GRADUATED' }
                    ]}
                />
            </div>
        </div>
    );
};

// ==========================================
// 3. NEW: FULL-WIDTH MEDIA UPLOADERS
// ==========================================
export const DocumentVaultUpload = ({ existingDocs = [] }: { existingDocs?: string[] }) => {
    // We store the actual File objects so we can accumulate them
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const syncToHiddenInput = (files: File[]) => {
        const dt = new DataTransfer();
        files.forEach(file => dt.items.add(file));
        if (inputRef.current) {
            inputRef.current.files = dt.files;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        const combinedFiles = [...stagedFiles, ...newFiles];
        setStagedFiles(combinedFiles);
        syncToHiddenInput(combinedFiles);
    };

    const removeFile = (indexToRemove: number) => {
        const updatedFiles = stagedFiles.filter((_, index) => index !== indexToRemove);
        setStagedFiles(updatedFiles);
        syncToHiddenInput(updatedFiles);
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-amber-50/40 border border-amber-200/60 rounded-2xl">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl border border-amber-200">
                        📄
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900 text-sm">Document Vault (कागजातहरू)</h3>
                        <p className="text-xs text-amber-700/80">Upload PDFs, Word files, or clear photos of official documents.</p>
                    </div>
                </div>
                
                <label className="cursor-pointer bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Select Documents
                    {/* Hidden input now uses a ref to store the accumulated files */}
                    <input ref={inputRef} type="file" name="documents" multiple accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>

            {/* Existing Documents Grid */}
            {existingDocs.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                    <span className="text-[10px] font-black text-amber-600/70 uppercase tracking-widest">Already Uploaded</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {existingDocs.map((url, idx) => (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-white rounded-lg border border-amber-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group">
                                <span className="text-xl group-hover:scale-110 transition-transform">📎</span>
                                <span className="text-xs font-bold text-amber-900 truncate">Document {idx + 1}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* New Upload Previews */}
            {stagedFiles.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                    <span className="text-[10px] font-black text-amber-600/70 uppercase tracking-widest">Staged for Upload</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {stagedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 p-3 bg-white/60 rounded-lg border border-amber-200 border-dashed text-amber-800">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-xl shrink-0">⏳</span>
                                    <span className="text-xs font-bold truncate">{file.name}</span>
                                </div>
                                <button type="button" onClick={() => removeFile(idx)} className="w-6 h-6 shrink-0 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-rose-200 transition-colors">
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export const PhotoGalleryUpload = ({ existingPhotos = [] }: { existingPhotos?: string[] }) => {
    // Store both the File object (for uploading) and its preview URL
    const [stagedImages, setStagedImages] = useState<{ file: File, url: string }[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const syncToHiddenInput = (images: { file: File }[]) => {
        const dt = new DataTransfer();
        images.forEach(img => dt.items.add(img.file));
        if (inputRef.current) {
            inputRef.current.files = dt.files;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        // Create URLs only for the new files
        const newStaged = newFiles.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        const combinedImages = [...stagedImages, ...newStaged];
        setStagedImages(combinedImages);
        syncToHiddenInput(combinedImages);
    };

    const removeImage = (indexToRemove: number) => {
        // Clean up the URL from browser memory to prevent lag
        URL.revokeObjectURL(stagedImages[indexToRemove].url);
        
        const updatedImages = stagedImages.filter((_, index) => index !== indexToRemove);
        setStagedImages(updatedImages);
        syncToHiddenInput(updatedImages);
    };

    // Clean up memory if component unmounts
    useEffect(() => {
        return () => stagedImages.forEach(img => URL.revokeObjectURL(img.url));
    }, []);

    return (
        <div className="flex flex-col gap-4 p-6 bg-indigo-50/40 border border-indigo-200/60 rounded-2xl w-full overflow-hidden">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl border border-indigo-200 shrink-0">
                        🖼️
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-sm">Photo Gallery (ग्यालेरी)</h3>
                        <p className="text-xs text-indigo-700/80">Upload casual images, events, or identifying photos.</p>
                    </div>
                </div>
                
                <label className="cursor-pointer shrink-0 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Select Photos
                    <input ref={inputRef} type="file" name="gallery" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>

            {/* Existing Photos Horizontal Slider */}
            {existingPhotos.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 w-full">
                    <span className="text-[10px] font-black text-indigo-600/70 uppercase tracking-widest">Already Uploaded</span>
                    {/* 👇 This is the slider container */}
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-indigo-300 w-full">
                        {existingPhotos.map((url, idx) => (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="relative shrink-0 w-32 h-32 snap-start group">
                                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-2xl shadow-sm border border-indigo-200 group-hover:opacity-80 group-hover:scale-105 transition-all" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* New Previews Horizontal Slider */}
            {stagedImages.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 w-full">
                    <span className="text-[10px] font-black text-indigo-600/70 uppercase tracking-widest">Staged for Upload</span>
                    {/* 👇 This is the slider container */}
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-indigo-300 w-full">
                        {stagedImages.map((img, idx) => (
                            <div key={idx} className="relative shrink-0 w-32 h-32 snap-start group">
                                <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-2xl border-2 border-indigo-400 border-dashed opacity-90" />
                                
                                {/* Overlay icon */}
                                <div className="absolute inset-0 bg-indigo-900/10 flex items-center justify-center rounded-2xl pointer-events-none">
                                    <span className="text-2xl drop-shadow-md">⏳</span>
                                </div>

                                {/* Remove Button */}
                                <button 
                                    type="button" 
                                    onClick={() => removeImage(idx)} 
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold border border-rose-200 shadow-sm hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};