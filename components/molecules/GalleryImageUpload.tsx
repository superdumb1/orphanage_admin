"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, X, Plus, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";

interface QueuedFile {
    file: File;
    preview: string;
    status: 'idle' | 'uploading' | 'success' | 'error';
}

export const GalleryImageUpload = ({ onUploadComplete }: { onUploadComplete?: () => void }) => {
    const params = useParams();
    const childId = params.id as string;
    
    const [queue, setQueue] = useState<QueuedFile[]>([]);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 1. Handle selection and generate previews
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newEntries: QueuedFile[] = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            status: 'idle'
        }));

        setQueue((prev) => [...prev, ...newEntries]);
    };

    // 2. The Multi-Asset Uplink Logic
    const initializeUplink = async () => {
        if (queue.length === 0 || isBroadcasting) return;
        setIsBroadcasting(true);

        // Process only idle files
        const filesToUpload = queue.filter(item => item.status === 'idle');

        for (const item of filesToUpload) {
            // Update status to uploading for this specific item
            setQueue(prev => prev.map(q => q.preview === item.preview ? { ...q, status: 'uploading' } : q));

            const formData = new FormData();
            formData.append('file', item.file);
            formData.append('field', 'gallery');

            try {
                const response = await fetch(`/api/children/${childId}/images/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    setQueue(prev => prev.map(q => q.preview === item.preview ? { ...q, status: 'success' } : q));
                } else {
                    setQueue(prev => prev.map(q => q.preview === item.preview ? { ...q, status: 'error' } : q));
                }
            } catch (err) {
                setQueue(prev => prev.map(q => q.preview === item.preview ? { ...q, status: 'error' } : q));
            }
        }

        setIsBroadcasting(false);
        if (onUploadComplete) onUploadComplete();
    };

    const removeImage = (index: number) => {
        setQueue((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-4 w-full transition-colors duration-500">
            {/* TACTICAL HEADER */}
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                    Multi_Asset_Ingestion_Protocol
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-primary uppercase">Queue: {queue.length} Packets</span>
                    <Zap size={10} className={queue.length > 0 ? "text-success animate-pulse" : "text-text-muted opacity-30"} />
                </div>
            </div>

            <div className="bg-card border border-border rounded-dashboard p-6 shadow-sm hover:border-primary/30 transition-all duration-500">

                {/* INGESTION GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {queue.map((item, index) => (
                        <div key={index} className="relative group aspect-square bg-bg border border-border/50 rounded-xl overflow-hidden">
                            <img
                                src={item.preview}
                                alt="Asset"
                                className={`w-full h-full object-cover transition-all duration-500 ${item.status === 'uploading' ? 'opacity-40 blur-[2px]' : 'grayscale-[0.3] group-hover:grayscale-0'}`}
                            />

                            {/* Status Overlays */}
                            {item.status === 'uploading' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                                    <Loader2 className="text-primary animate-spin" size={24} />
                                </div>
                            )}

                            {item.status === 'success' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-success/20">
                                    <CheckCircle2 className="text-success" size={24} />
                                </div>
                            )}

                            {item.status === 'idle' && (
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute inset-0 bg-danger/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                    <X size={20} className="text-text-invert" />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* UPLOAD TRIGGER CELL */}
                    <label className="relative aspect-square flex flex-col items-center justify-center gap-2 bg-shaded/30 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:bg-shaded hover:border-primary/40 transition-all group">
                        <input
                            ref={inputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isBroadcasting}
                        />
                        <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={20} className="text-text-muted group-hover:text-primary" />
                        </div>
                        <span className="text-[8px] font-mono uppercase tracking-widest text-text-muted">Add_Packet</span>
                    </label>
                </div>

                {/* INTERFACE COMMANDS */}
                <div className="flex flex-col gap-3 border-t border-border/40 pt-5">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="flex flex-col font-mono">
                                <span className="text-[7px] text-text-muted uppercase">Encryp_State</span>
                                <span className={`text-[9px] font-bold ${isBroadcasting ? 'text-primary animate-pulse' : 'text-text'}`}>
                                    {isBroadcasting ? 'STREAMING' : 'READY'}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={initializeUplink}
                            disabled={isBroadcasting || queue.filter(i => i.status === 'idle').length === 0}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-text-invert rounded-xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                        >
                            {isBroadcasting ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                            {isBroadcasting ? "Broadcasting_Data..." : "Initialize_Uplink"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};