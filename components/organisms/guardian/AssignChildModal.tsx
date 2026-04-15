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
    children: ChildOption[];
}) => {
    const [selectedChildId, setSelectedChildId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [state, formAction, isPending] = useActionState(
        assignChildToGuardian as any,
        { error: null, success: false }
    );

    const filteredChildren = children.filter(c =>
        `${c.firstName} ${c.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="p-6 border-b border-zinc-200 bg-zinc-50">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                        Confirm Placement
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                        Select a child to assign to this guardian.
                    </p>
                </div>

                {/* SEARCH */}
                <div className="p-4 border-b border-zinc-200 bg-white">
                    <input
                        type="text"
                        placeholder="Search child..."
                        className="w-full p-3 text-sm border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* LIST */}
                <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 flex flex-col gap-2">

                    {filteredChildren.map((child) => (
                        <div
                            key={child._id}
                            onClick={() => setSelectedChildId(child._id)}
                            className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                                selectedChildId === child._id
                                    ? "border-zinc-900 bg-white shadow-sm"
                                    : "border-zinc-200 bg-white hover:border-zinc-300"
                            }`}
                        >
                            <img
                                src={child.profileImageUrl || "/placeholder.png"}
                                className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                                alt=""
                            />

                            <div className="flex-1">
                                <p className="font-bold text-zinc-900 text-sm">
                                    {child.firstName} {child.lastName}
                                </p>
                                <p className="text-[10px] text-zinc-500 font-medium">
                                    DOB: {new Date(child.dateOfBirth).toLocaleDateString()}
                                </p>
                            </div>

                            {selectedChildId === child._id && (
                                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs">
                                    ✓
                                </div>
                            )}
                        </div>
                    ))}

                </div>

                {/* FOOTER FORM */}
                <form action={formAction} className="p-6 border-t border-zinc-200 bg-white">

                    <input type="hidden" name="guardianId" value={guardianId} />
                    <input type="hidden" name="childId" value={selectedChildId} />

                    <div className="mb-4">
                        <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">
                            Placement Type
                        </label>

                        <select
                            name="placementType"
                            required
                            className="mt-2 w-full p-3 text-sm border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900"
                        >
                            <option value="FOSTERED">Fostering (Temporary)</option>
                            <option value="ADOPTED">Adoption (Permanent)</option>
                        </select>
                    </div>

                    {state?.error && (
                        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl mb-4">
                            ⚠️ {state.error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending || !selectedChildId}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-8"
                        >
                            {isPending ? "Syncing..." : "Finalize Placement"}
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );
};