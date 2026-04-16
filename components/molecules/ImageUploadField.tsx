"use client";

import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, User, Trash2, Camera } from "lucide-react";

export const ImageUploadField = ({ defaultValue }: { defaultValue?: string }) => {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(defaultValue || null);
    }, [defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    const handleClear = () => {
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = ""; 
        }
    };

    return (
        // Added a fixed max-width so it doesn't blow out the grid
        <div className="flex flex-col gap-3 w-full max-w-[220px] transition-colors duration-500">
            {/* MICRO-CAPS LABEL (Centered) */}
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-80 px-1 text-center">
                ID Badge
            </label>

            {/* UPLOAD MODULE SHELL (Changed to flex-col and centered) */}
            <div className="flex flex-col items-center justify-center text-center gap-5 p-6 bg-shaded/30 border border-border/50 rounded-dashboard group transition-all hover:border-primary/30">
                
                {/* 1. THE PREVIEW BOX */}
                <div className="relative shrink-0">
                    <div className={`
                        relative w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300
                        ${preview ? 'border border-border shadow-md' : 'border-2 border-dashed border-border/60 bg-bg'}
                    `}>
                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </>
                        ) : (
                            <User size={32} className="text-text-muted opacity-20" />
                        )}
                    </div>

                    {/* Status Dot */}
                    {preview && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card shadow-sm flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                    )}
                </div>

                {/* 2. THE CONTROLS (Vertical stack) */}
                <div className="flex w-full flex-col gap-4">
                    
                    <div className="flex flex-col items-center gap-2 w-full">
                        <input
                            ref={inputRef}
                            type="file"
                            name="profilePicture" 
                            id="profileUpload"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        
                        <label 
                            htmlFor="profileUpload"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bg border border-border text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary hover:border-primary/40 cursor-pointer transition-all active:scale-95 shadow-sm"
                        >
                            <UploadCloud size={14} />
                            {preview ? "Change" : "Upload"}
                        </label>

                        {preview && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-danger/10 border border-danger/20 text-danger text-[10px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all active:scale-95"
                            >
                                <Trash2 size={12} />
                                Remove
                            </button>
                        )}
                    </div>

                    {/* File Requirements */}
                    <div className="flex flex-col gap-1 border-t border-border/50 pt-3">
                        <p className="text-[8px] text-text-muted/60 uppercase font-black tracking-[0.15em]">
                            JPG, PNG, WEBP
                        </p>
                        <p className="text-[8px] text-text-muted/60 uppercase font-black tracking-[0.15em]">
                            Max 2.0 MB
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};