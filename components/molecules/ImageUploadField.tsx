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
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-zinc-700">
        Profile Photo
      </label>

      {preview && (
        <img
          src={preview}
          alt="Profile preview"
          className="w-16 h-16 rounded-full object-cover border border-zinc-200"
        />
      )}

      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
        className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 transition"
      />
    </div>
  );
};