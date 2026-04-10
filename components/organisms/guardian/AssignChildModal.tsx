"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { assignChildToGuardian } from "@/app/actions/placement";

interface ChildOption {
    _id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    dateOfBirth: Date;
}

export const AssignChildModal = ({ 
    isOpen, 
    onClose, 
    guardianId, 
    children 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    guardianId: string;
    children: ChildOption[] 
}) => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    
    const [state, formAction, isPending] = useActionState(assignChildToGuardian as any, { error: null, success: false });

    // Filter children based on search
    const filteredChildren = children.filter(c => 
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 flex flex-col max-h-[90vh]">
                
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                    <h2 className="text-xl font-black text-zinc-900">Confirm Placement</h2>
                    <p className="text-xs text-zinc-500 font-medium">Visually verify the child before finalizing the link.</p>
                </div>

                <div className="p-4 border-b border-zinc-100">
                    <input 
                        type="text"
                        placeholder="Search by name..."
                        className="w-full p-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* --- Visual Selection List --- */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-zinc-50/30">
                    {filteredChildren.map((child) => (
                        <div 
                            key={child._id}
                            onClick={() => setSelectedChildId(child._id)}
                            className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedChildId === child._id 
                                ? 'border-zinc-900 bg-zinc-100 shadow-sm' 
                                : 'border-transparent bg-white hover:border-zinc-200'
                            }`}
                        >
                            <img 
                                src={child.profileImageUrl || "/placeholder-child.png"} 
                                alt="" 
                                className="w-12 h-12 rounded-full object-cover border border-zinc-200" 
                            />
                            <div className="flex-1">
                                <p className="font-bold text-zinc-900 text-sm">{child.firstName} {child.lastName}</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                                    DOB: {new Date(child.dateOfBirth).toLocaleDateString()}
                                </p>
                            </div>
                            {selectedChildId === child._id && (
                                <div className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center text-xs">✓</div>
                            )}
                        </div>
                    ))}
                </div>

                <form action={formAction} className="p-6 border-t border-zinc-100 bg-white">
                    <input type="hidden" name="guardianId" value={guardianId} />
                    <input type="hidden" name="childId" value={selectedChildId} />
                    
                    <div className="mb-4">
                        <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest block mb-2">Placement Type</label>
                        <select name="placementType" required className="w-full p-2 text-sm border border-zinc-200 rounded-lg outline-none">
                            <option value="FOSTERED">Fostering (अस्थायी)</option>
                            <option value="ADOPTED">Adoption (स्थायी)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button 
                            type="submit" 
                            disabled={isPending || !selectedChildId} 
                            className="bg-zinc-900 text-white font-bold px-8"
                        >
                            {isPending ? "Syncing..." : "Finalize Placement"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};