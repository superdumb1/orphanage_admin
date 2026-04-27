"use client"

import { FileText, ImageIcon, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";


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