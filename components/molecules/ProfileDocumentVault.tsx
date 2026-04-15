
import { quickUploadMedia } from "@/app/actions/child";
import { useRef, useState, useEffect, useTransition } from "react";

export const ProfileDocumentVault = ({ childId, existingDocs = [] }: { childId: string, existingDocs?: string[] }) => {
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            setStagedFiles(prev => [...prev, ...newFiles]);
        }
        // Reset input so you can select the same file again if needed
        if (inputRef.current) inputRef.current.value = '';
    };

    const removeFile = (indexToRemove: number) => {
        setStagedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpload = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("childId", childId);
            formData.append("uploadType", "documents");
            stagedFiles.forEach(file => formData.append("files", file));

            const result = await quickUploadMedia(null, formData);
            if (result?.success) {
                setStagedFiles([]); // Clear staging area on success!
            } else {
                alert(result?.error || "Failed to upload documents.");
            }
        });
    };

    return (
        <div className="bg-amber-50/40 p-6 rounded-2xl shadow-sm border border-amber-200 flex flex-col h-full">
            <h2 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2 border-b border-amber-200 pb-2">📄 Document Vault</h2>
            
            {/* Existing Documents */}
            <div className="flex flex-col gap-3 mb-4 overflow-y-auto max-h-40 pr-2 scrollbar-thin scrollbar-thumb-amber-200">
                {existingDocs?.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold text-amber-800 bg-white p-3 rounded-xl border border-amber-200 hover:shadow-md transition-shadow group">
                        <span className="text-xl group-hover:scale-110 transition-transform">📎</span> 
                        Document {i + 1} 
                        <span className="ml-auto text-[10px] text-amber-500 bg-amber-100 px-2 py-1 rounded-md">VIEW</span>
                    </a>
                ))}
                {existingDocs.length === 0 && <p className="text-xs text-amber-600 font-medium">No documents uploaded yet.</p>}
            </div>

            {/* Staged Previews */}
            {stagedFiles.length > 0 && (
                <div className="flex flex-col gap-2 mb-4 pt-4 border-t border-amber-200/50">
                    <span className="text-[10px] font-black text-amber-600/70 uppercase tracking-widest">Staged for Upload</span>
                    <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-200">
                        {stagedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 p-2.5 bg-white/60 rounded-lg border border-amber-300 border-dashed text-amber-800">
                                <div className="flex items-center gap-2 overflow-hidden text-xs font-bold truncate">
                                    <span className="shrink-0 text-sm">⏳</span> {file.name}
                                </div>
                                <button type="button" onClick={() => removeFile(idx)} className="w-5 h-5 shrink-0 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-rose-600 hover:text-white transition-colors">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Controls */}
            <div className="mt-auto pt-4 flex gap-2">
                <label className="cursor-pointer flex-1 text-center bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all">
                    + Select Files
                    <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx,image/*" onChange={handleFileChange} className="hidden" />
                </label>
                
                {stagedFiles.length > 0 && (
                    <button 
                        onClick={handleUpload} 
                        disabled={isPending}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isPending ? "Uploading..." : `Upload (${stagedFiles.length})`}
                    </button>
                )}
            </div>
        </div>
    );
};

export const ProfilePhotoGallery = ({ childId, existingPhotos = [] }: { childId: string, existingPhotos?: string[] }) => {
    const [stagedImages, setStagedImages] = useState<{ file: File, url: string }[]>([]);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            const newStaged = newFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
            setStagedImages(prev => [...prev, ...newStaged]);
        }
        if (inputRef.current) inputRef.current.value = '';
    };

    const removeImage = (indexToRemove: number) => {
        URL.revokeObjectURL(stagedImages[indexToRemove].url);
        setStagedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    useEffect(() => {
        return () => stagedImages.forEach(img => URL.revokeObjectURL(img.url)); // Cleanup memory
    }, []);

    const handleUpload = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("childId", childId);
            formData.append("uploadType", "gallery");
            stagedImages.forEach(img => formData.append("files", img.file));

            const result = await quickUploadMedia(null, formData);
            if (result?.success) {
                setStagedImages([]); // Clear staging on success!
            } else {
                alert(result?.error || "Failed to upload photos.");
            }
        });
    };

    return (
        <div className="bg-indigo-50/40 p-6 rounded-2xl shadow-sm border border-indigo-200 flex flex-col h-full overflow-hidden">
            <h2 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2 border-b border-indigo-200 pb-2">🖼️ Photo Gallery</h2>
            
            {/* Existing Photos Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4 overflow-y-auto max-h-40 pr-2 scrollbar-thin scrollbar-thumb-indigo-200">
                {existingPhotos?.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-xl border border-indigo-200 overflow-hidden bg-white shadow-sm group">
                        <img src={url} alt={`Gallery ${i}`} className="object-cover w-full h-full group-hover:scale-110 group-hover:opacity-80 transition-all" />
                    </a>
                ))}
                {existingPhotos.length === 0 && <p className="text-xs text-indigo-600 font-medium col-span-3">No photos uploaded yet.</p>}
            </div>

            {/* Staged Previews Slider */}
            {stagedImages.length > 0 && (
                <div className="flex flex-col gap-2 mb-4 pt-4 border-t border-indigo-200/50 w-full">
                    <span className="text-[10px] font-black text-indigo-600/70 uppercase tracking-widest">Staged for Upload</span>
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-indigo-300 w-full">
                        {stagedImages.map((img, idx) => (
                            <div key={idx} className="relative shrink-0 w-20 h-20 snap-start group">
                                <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-xl border-2 border-indigo-400 border-dashed opacity-90" />
                                <div className="absolute inset-0 bg-indigo-900/10 flex items-center justify-center rounded-xl pointer-events-none">
                                    <span className="text-sm drop-shadow-md">⏳</span>
                                </div>
                                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-rose-200 hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Controls */}
            <div className="mt-auto pt-4 flex gap-2 w-full">
                <label className="cursor-pointer flex-1 text-center bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all">
                    + Select Photos
                    <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {stagedImages.length > 0 && (
                    <button 
                        onClick={handleUpload} 
                        disabled={isPending}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isPending ? "Uploading..." : `Upload (${stagedImages.length})`}
                    </button>
                )}
            </div>
        </div>
    );
};