// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/atoms/Button";
// import { useUIModals } from "@/hooks/useUIModal";

// export const AssignedChildrenClient = ({
//     guardian,
//     children
// }: {
//     guardian: any;
//     children: any[];
// }) => {
//     const {openAssignChildrenModal}=useUIModals()

//     return (
//         // Container: Updated bg-white -> bg-card, border-zinc-200 -> border-border
//         <div className="bg-card border border-border rounded-dashboard shadow-glow p-6 transition-colors duration-500">

//             {/* HEADER */}
//             <div className="flex items-center justify-between mb-6">

//                 {/* Typography: text-zinc-900 -> text-text */}
//                 <h2 className="text-lg font-black text-text tracking-tight">
//                     Assigned Children
//                 </h2>

//                 {/* Button: Replaced manual zinc colors with btn-primary utility */}
//                 <Button
//                     onClick={() => openAssignChildrenModal(guardian._id)}
//                     className="btn-primary text-xs h-9 px-5"
//                 >
//                     + Add Placement
//                 </Button>
//             </div>


//             {/* CONTENT */}
//             {guardian.assignedChildren?.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//                     {guardian.assignedChildren.map((child: any) => (
//                         <Link
//                             href={`/children/${child._id}`}
//                             key={child._id}
//                             // Card Item: Uses bg-card, border-border, and introduces a subtle hover state using primary/30
//                             className="flex items-center gap-4 bg-card border border-border p-4 rounded-2xl hover:shadow-md hover:border-primary/30 hover:bg-shaded/30 transition-all duration-300 group"
//                         >
//                             {child.profileImageUrl ? (
//                                 <img
//                                     src={child.profileImageUrl}
//                                     alt={`${child.firstName} ${child.lastName}`}
//                                     className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
//                                 />
//                             ) : (
//                                 // Added a subtle fallback avatar just in case the child has no image yet!
//                                 <div className="w-12 h-12 rounded-full border border-border bg-shaded flex items-center justify-center text-xl grayscale opacity-50 shadow-inner">
//                                     🧒
//                                 </div>
//                             )}

//                             <div>
//                                 {/* Name: text-zinc-900 -> text-text, turns primary on hover */}
//                                 <p className="text-text font-bold text-sm group-hover:text-primary transition-colors">
//                                     {child.firstName} {child.lastName}
//                                 </p>

//                                 {/* Status: text-zinc-500 -> text-text-muted */}
//                                 <p className="text-text-muted text-[10px] uppercase font-black tracking-widest mt-0.5">
//                                     {child.status}
//                                 </p>
//                             </div>
//                         </Link>
//                     ))}

//                 </div>
//             ) : (
//                 // EMPTY STATE: bg-zinc-50 -> bg-shaded/50, dashed border for dropzone feel
//                 <div className="py-12 text-center bg-shaded/50 rounded-2xl border border-dashed border-border transition-colors">
//                     <p className="text-text-muted text-sm font-bold tracking-wide">
//                         No children assigned to this guardian yet
//                     </p>
//                     <p className="text-[10px] text-text-muted/60 mt-1 uppercase tracking-widest font-medium">
//                         Click "Add Placement" to link a child
//                     </p>
//                 </div>
//             )}

//         </div>
//     );
// };