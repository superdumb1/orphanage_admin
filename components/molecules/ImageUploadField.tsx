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
    <div className="flex flex-col gap-3 w-full">

      {/* Label */}
      <label className="text-sm font-medium text-text">
        Profile Photo
      </label>

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="Profile preview"
          className="w-16 h-16 rounded-full object-cover border border-border shadow-sm"
        />
      )}

      {/* File Input */}
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
        className={`
          w-full text-sm text-text-muted
          cursor-pointer

          file:mr-4 file:py-2 file:px-4
          file:rounded-xl file:border-0
          file:text-sm file:font-medium

          file:bg-primary/10 file:text-primary
          hover:file:bg-primary/20

          transition-all duration-200
        `}
      />
    </div>
  );
};