"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";

// Define the shape of our relative object
type Relative = {
    id: string; // Unique ID for React rendering
    name: string;
    relation: string;
    phone: string;
    email: string;
    photoPreview: string | null;
};

export const KnownRelatives = ({ initialRelatives = [] }: { initialRelatives?: any[] }) => {
    // Initialize state with existing data, or an empty array
    const [relatives, setRelatives] = useState<Relative[]>(
        initialRelatives.length > 0 ? initialRelatives : []
    );

    const addRelative = () => {
        setRelatives([
            ...relatives,
            { id: Math.random().toString(36).substring(7), name: "", relation: "", phone: "", email: "", photoPreview: null }
        ]);
    };

    const removeRelative = (idToRemove: string) => {
        setRelatives(relatives.filter((rel) => rel.id !== idToRemove));
    };

    const handlePhotoChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setRelatives(relatives.map(rel => rel.id === id ? { ...rel, photoPreview: previewUrl } : rel));
        }
    };

    return (
        <div className="flex flex-col gap-4 p-5 bg-zinc-50/50 border border-zinc-200 rounded-2xl mt-2">
            
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍👩‍👧‍👦</span>
                    <div>
                        <h3 className="font-bold text-zinc-900 text-sm">Known Relatives (ज्ञात आफन्तहरू)</h3>
                        <p className="text-[11px] text-zinc-500">Add family members, emergency contacts, or sponsors.</p>
                    </div>
                </div>
            </div>

            {/* Render the dynamic list of relatives */}
            <div className="flex flex-col gap-4">
                {relatives.map((relative, index) => (
                    <div key={relative.id} className="relative bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col gap-4 group transition-all animate-in fade-in zoom-in-95 duration-300">
                        
                        {/* Remove Button (Appears on hover) */}
                        <button 
                            type="button" 
                            onClick={() => removeRelative(relative.id)}
                            className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-rose-200 hover:bg-rose-200 hover:scale-105"
                            title="Remove Relative"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col md:flex-row gap-5 items-start">
                            
                            {/* MINI PHOTO UPLOADER */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                                <div className="relative w-16 h-16 rounded-full group/avatar cursor-pointer">
                                    {relative.photoPreview ? (
                                        <img 
                                            src={relative.photoPreview} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover rounded-full border-2 border-white outline outline-1 outline-zinc-200 shadow-sm" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl border border-blue-100 group-hover/avatar:bg-blue-100 transition-colors shadow-sm">
                                            👤
                                        </div>
                                    )}
                                    {/* Notice the unique name: relative_photo_0, relative_photo_1 */}
                                    <input
                                        type="file"
                                        name={`relative_photo_${index}`}
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(relative.id, e)}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="absolute bottom-0 right-0 bg-white border border-zinc-200 rounded-full w-5 h-5 flex items-center justify-center text-[8px] shadow-sm pointer-events-none z-20">
                                        📷
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Optional</span>
                            </div>

                            {/* RELATIVE DETAILS FORM */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                {/* Hidden input to tell the backend how many relatives to loop through */}
                                <input type="hidden" name="relativesCount" value={relatives.length} />
                                
                                {/* Unique names for standard text inputs */}
                                <FormField label="Full Name" name={`relative_name_${index}`} defaultValue={relative.name} required />
                                <FormField label="Relationship" name={`relative_relation_${index}`} defaultValue={relative.relation} placeholder="e.g. Aunt, Uncle, Sibling" required />
                                <FormField label="Phone Number" name={`relative_phone_${index}`} defaultValue={relative.phone} />
                                <FormField label="Email Address" name={`relative_email_${index}`} defaultValue={relative.email} type="email" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD RELATIVE BUTTON */}
            <Button 
                type="button" 
                variant="ghost" 
                onClick={addRelative}
                className="w-full py-4 border-2 border-dashed border-zinc-300 text-zinc-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl flex items-center justify-center gap-2 font-bold"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Relative
            </Button>

        </div>
    );
};