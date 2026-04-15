"use client";

import { quickUploadMedia } from "@/app/actions/child";
import { useRef, useState, useEffect, useTransition } from "react";

/* ================= DOCUMENT VAULT ================= */
export const ProfileDocumentVault = ({ childId, existingDocs = [] }: { childId: string, existingDocs?: string[] }) => {
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            setStagedFiles(prev => [...prev, ...newFiles]);
        }
        if (inputRef.current) inputRef.current.value = '';
    };

    const removeFile = (index: number) => {
        setStagedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("childId", childId);
            formData.append("uploadType", "documents");
            stagedFiles.forEach(file => formData.append("files", file));

            const result = await quickUploadMedia(null, formData);
            if (result?.success) setStagedFiles([]);
            else alert(result?.error || "Failed to upload documents.");
        });
    };

    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-glow flex flex-col h-full">
            <h2 className="text-lg font-black text-text mb-4 flex items-center gap-2 border-b border-border pb-2">
                📄 Document Vault
            </h2>

            {/* Existing */}
            <div className="flex flex-col gap-3 mb-4 max-h-40 overflow-y-auto">
                {existingDocs?.map((url, i) => (
                    <a key={i} href={url} target="_blank"
                        className="flex items-center gap-3 text-sm font-bold text-text bg-shaded p-3 rounded-xl border border-border hover:shadow-glow transition group">
                        <span className="text-xl">📎</span>
                        Document {i + 1}
                        <span className="ml-auto text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-md">
                            VIEW
                        </span>
                    </a>
                ))}
                {existingDocs.length === 0 && (
                    <p className="text-xs text-text-muted">No documents uploaded yet.</p>
                )}
            </div>

            {/* Staged */}
            {stagedFiles.length > 0 && (
                <div className="flex flex-col gap-2 mb-4 pt-4 border-t border-border">
                    <span className="text-[10px] font-black text-text-muted uppercase">
                        Staged for Upload
                    </span>

                    {stagedFiles.map((file, idx) => (
                        <div key={idx}
                            className="flex justify-between items-center p-2.5 bg-card rounded-lg border border-border text-text">
                            <span className="text-xs font-bold truncate">⏳ {file.name}</span>
                            <button onClick={() => removeFile(idx)}
                                className="w-5 h-5 bg-danger/10 text-danger rounded-full text-[10px] hover:bg-danger hover:text-white">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="mt-auto pt-4 flex gap-2">
                <label className="flex-1 text-center cursor-pointer bg-card border border-border text-text hover:bg-shaded px-4 py-2.5 rounded-xl text-xs font-bold">
                    + Select Files
                    <input ref={inputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
                </label>

                {stagedFiles.length > 0 && (
                    <button
                        onClick={handleUpload}
                        disabled={isPending}
                        className="flex-1 btn-primary text-xs flex justify-center items-center"
                    >
                        {isPending ? "Uploading..." : `Upload (${stagedFiles.length})`}
                    </button>
                )}
            </div>
        </div>
    );
};


/* ================= PHOTO GALLERY ================= */
export const ProfilePhotoGallery = ({ childId, existingPhotos = [] }: { childId: string, existingPhotos?: string[] }) => {
    const [stagedImages, setStagedImages] = useState<{ file: File, url: string }[]>([]);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const mapped = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setStagedImages(prev => [...prev, ...mapped]);
        if (inputRef.current) inputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(stagedImages[index].url);
        setStagedImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        return () => stagedImages.forEach(img => URL.revokeObjectURL(img.url));
    }, []);

    const handleUpload = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("childId", childId);
            formData.append("uploadType", "gallery");
            stagedImages.forEach(img => formData.append("files", img.file));

            const result = await quickUploadMedia(null, formData);
            if (result?.success) setStagedImages([]);
            else alert(result?.error || "Failed to upload photos.");
        });
    };

    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-glow flex flex-col h-full overflow-hidden">
            <h2 className="text-lg font-black text-text mb-4 border-b border-border pb-2">
                🖼️ Photo Gallery
            </h2>

            {/* Existing */}
            <div className="grid grid-cols-3 gap-3 mb-4 max-h-40 overflow-y-auto">
                {existingPhotos?.map((url, i) => (
                    <a key={i} href={url} target="_blank"
                        className="aspect-square rounded-xl border border-border overflow-hidden bg-card group">
                        <img src={url} className="object-cover w-full h-full group-hover:scale-110 transition" />
                    </a>
                ))}
                {existingPhotos.length === 0 && (
                    <p className="text-xs text-text-muted col-span-3">No photos uploaded yet.</p>
                )}
            </div>

            {/* Staged */}
            {stagedImages.length > 0 && (
                <div className="flex gap-3 overflow-x-auto mb-4">
                    {stagedImages.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20">
                            <img src={img.url} className="w-full h-full object-cover rounded-xl border border-border" />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-0 right-0 w-5 h-5 bg-danger text-white text-xs rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="mt-auto pt-4 flex gap-2">
                <label className="flex-1 text-center cursor-pointer bg-card border border-border text-text hover:bg-shaded px-4 py-2.5 rounded-xl text-xs font-bold">
                    + Select Photos
                    <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {stagedImages.length > 0 && (
                    <button
                        onClick={handleUpload}
                        disabled={isPending}
                        className="flex-1 btn-primary text-xs flex justify-center items-center"
                    >
                        {isPending ? "Uploading..." : `Upload (${stagedImages.length})`}
                    </button>
                )}
            </div>
        </div>
    );
};