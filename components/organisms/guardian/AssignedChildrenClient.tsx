"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/atoms/Button";
import { AssignChildModal } from './AssignChildModal';

export const AssignedChildrenClient = ({ guardian, children }: { guardian: any, children: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white">Assigned Children</h2>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-white text-zinc-900 hover:bg-zinc-200 text-xs font-bold py-1 h-8"
                >
                    + Add Placement
                </Button>
            </div>

            <AssignChildModal
                guardianId={guardian._id}
                isOpen={isOpen}
                children={children} 
                onClose={() => setIsOpen(false)}
            />

            {guardian.assignedChildren && guardian.assignedChildren.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guardian.assignedChildren.map((child: any) => (
                        <Link href={`/children/${child._id}`} key={child._id} className="flex items-center gap-4 bg-zinc-800 p-4 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700">
                            <img src={child.profileImageUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-zinc-600" />
                            <div>
                                <p className="text-white font-bold text-sm">{child.firstName} {child.lastName}</p>
                                <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">{child.status}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-10 text-center">
                    <p className="text-zinc-500 text-sm font-medium">This family currently has no assigned children.</p>
                </div>
            )}
        </div>
    );
};