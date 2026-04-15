"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { AssignChildModal } from "./AssignChildModal";

export const AssignedChildrenClient = ({
    guardian,
    children
}: {
    guardian: any;
    children: any[];
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

                <h2 className="text-lg font-black text-zinc-900 tracking-tight">
                    Assigned Children
                </h2>

                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold h-8 px-4"
                >
                    + Add Placement
                </Button>
            </div>

            {/* MODAL */}
            <AssignChildModal
                guardianId={guardian._id}
                isOpen={isOpen}
                children={children}
                onClose={() => setIsOpen(false)}
            />

            {/* CONTENT */}
            {guardian.assignedChildren?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {guardian.assignedChildren.map((child: any) => (
                        <Link
                            href={`/children/${child._id}`}
                            key={child._id}
                            className="flex items-center gap-4 bg-white border border-zinc-200 p-4 rounded-2xl hover:shadow-md hover:border-zinc-300 transition-all"
                        >
                            <img
                                src={child.profileImageUrl}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                            />

                            <div>
                                <p className="text-zinc-900 font-bold text-sm">
                                    {child.firstName} {child.lastName}
                                </p>

                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                                    {child.status}
                                </p>
                            </div>
                        </Link>
                    ))}

                </div>
            ) : (
                <div className="py-10 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
                    <p className="text-zinc-500 text-sm font-medium">
                        No children assigned to this guardian yet
                    </p>
                </div>
            )}

        </div>
    );
};