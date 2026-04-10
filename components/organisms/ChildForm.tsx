"use client";
import React, { useActionState } from "react"; // ✨ IMPORT THE HOOK ✨
import { FormField } from "../molecules/FormField";
import { SelectField } from "../molecules/SelectField";
import { Button } from "../atoms/Button";
import { createChild, updateChild } from "@/app/actions/child";
import { ImageUploadField } from "../molecules/ImageUploadField";

const initialState = { error: null as string | null };

export const ChildForm = ({ initialData }: { initialData?: any }) => {
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

    return (
        <form action={formAction} className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-4 max-w-4xl">     
            {initialData && <input type="hidden" name="_id" value={initialData._id} />}
            
            {/* Show any errors returned by the server */}
            {state?.error && (
                <div className="p-4 bg-red-50 text-red-700 font-medium rounded-lg border border-red-200">
                    ⚠️ {state.error}
                </div>
            )}

            <ImageUploadField defaultValue={initialData?.profileImageUrl} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="First Name" name="firstName" id="firstName" required defaultValue={initialData?.firstName} />
                <FormField label="Last Name" name="lastName" id="lastName" required defaultValue={initialData?.lastName} />
                <SelectField label="Gender" name="gender" id="gender" required defaultValue={initialData?.gender} options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }, { label: 'Other', value: 'OTHER' }]} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Date of Birth" name="dateOfBirth" id="dob" type="date" required defaultValue={dob} />
                <FormField label="Admission Date" name="admissionDate" id="adminDate" required defaultValue={adminDate} type="date" />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
                <SelectField label="Blood Type" name="bloodType" id="bloodType" defaultValue={initialData?.bloodType} options={bTypes} />
                <FormField label="Allergies" name="allergies" id="allergies" defaultValue={initialData?.allergies} placeholder="e.g. Peanuts" />
                <FormField label="Known Relatives" name="knownRelatives" id="relatives" defaultValue={initialData?.knownRelatives} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="School Name" name="schoolName" id="school" defaultValue={initialData?.schoolName} />
                <FormField label="Grade Level" name="gradeLevel" id="grade" defaultValue={initialData?.gradeLevel} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                <SelectField label="Arrival Category" name="arrivalCategory" id="arrivalCategory" required defaultValue={initialData?.arrivalCategory || 'OTHER'} options={arrivalOpts} />
                <FormField label="Arrival Story / Details" name="arrivalDetails" id="arrivalDetails" defaultValue={initialData?.arrivalDetails} placeholder="Brief summary of their background..." />
            </div>

            <FormField label="Medical Notes" name="medicalNotes" id="medicalNotes" defaultValue={initialData?.medicalNotes} />

            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 mt-2">
                
                <div className="flex flex-col gap-2 p-5 bg-amber-50/50 border border-amber-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">📄</span>
                        <h3 className="font-bold text-amber-900 text-sm">Document Vault (कागजातहरू)</h3>
                    </div>
                    <p className="text-xs text-amber-700 mb-3">
                        Upload PDFs, Word files, or <b>clear photos</b> of official documents (Birth Certificates, Court Orders, Medical Reports).
                    </p>
                    <input 
                        type="file" 
                        name="documents" 
                        multiple 
                        accept=".pdf,.doc,.docx,image/*" 
                        className="w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition-all cursor-pointer"
                    />
                    
                    {/* Render existing documents if editing */}
                    {initialData?.documents && initialData.documents.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                            {initialData.documents.map((url: string, idx: number) => (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1">
                                    📎 View Document {idx + 1}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: Photo Gallery */}
                <div className="flex flex-col gap-2 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🖼️</span>
                        <h3 className="font-bold text-indigo-900 text-sm">Photo Gallery (ग्यालेरी)</h3>
                    </div>
                    <p className="text-xs text-indigo-700 mb-3">
                        Upload casual images showing the child's progress, events, or identifying photos.
                    </p>
                    <input 
                        type="file" 
                        name="gallery" 
                        multiple 
                        accept="image/*"
                        className="w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer"
                    />
                    
                    {/* Render existing photos if editing */}
                    {initialData?.gallery && initialData.gallery.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                            {initialData.gallery.map((url: string, idx: number) => (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt={`Gallery ${idx}`} className="h-12 w-12 object-cover rounded shadow-sm border border-indigo-200 hover:opacity-80 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-zinc-100">
                <Button type="submit" disabled={isPending} className="disabled:opacity-50">
                    {isPending ? "Saving..." : (initialData ? "Update Record" : "Save Child Record")}
                </Button>
            </div>
        </form>
    );
};