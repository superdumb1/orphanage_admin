"use client";

import React, { useEffect, useState } from "react";

export const ImageUploadField = ({ defaultValue }: { defaultValue?: string }) => {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);

  useEffect(() => {
    setPreview(defaultValue || null);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div className="flex flex-col gap-3 w-full transition-colors duration-500">

      {/* Label: Synced with OrphanAdmin Micro-caps scale */}
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted opacity-80 px-1">
        Profile Photo
      </label>

      <div className="flex items-center gap-5 p-4 bg-shaded/50 border border-border rounded-2xl group transition-all hover:border-primary/30">
        
        {/* Preview Container */}
        <div className="relative shrink-0">
          <div className={`
            w-16 h-16 rounded-2xl overflow-hidden border-2 border-card shadow-glow bg-bg
            flex items-center justify-center
            ${!preview ? 'border-dashed border-border' : 'border-primary/20'}
          `}>
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <span className="text-2xl opacity-20">👤</span>
            )}
          </div>
          
          {/* Status Indicator */}
          {preview && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card shadow-sm" />
          )}
        </div>

        {/* File Input Logic */}
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className={`
              w-full text-[11px] font-bold text-text-muted
              cursor-pointer outline-none

              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-[10px] file:font-black file:uppercase file:tracking-widest

              file:bg-primary/10 file:text-primary
              hover:file:bg-primary/20
              file:cursor-pointer

              transition-all duration-300
            `}
          />
          <p className="text-[9px] text-text-muted/60 uppercase font-black tracking-widest px-1">
            Max 2MB • JPG or PNG
          </p>
        </div>
      </div>
    </div>
  );
};