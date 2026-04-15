"use client";
import React, { useEffect, useState } from "react";
import { DataRow, DetailCard } from "@/components/organisms/child/child-profile/DetailCard";
import { ProfileHeader } from "@/components/organisms/child/child-profile/ProfileHeader";
import { ActionPlanSection } from "@/components/organisms/child/child-profile/ActionPlanSection";
import { getChildActionPlans } from "@/app/actions/getChildActionPlans";
import { ProfileDocumentVault, ProfilePhotoGallery } from "@/components/molecules/ProfileDocumentVault";



interface ViewChildModalProps {
    isOpen: boolean;
    onClose: () => void;
    child: any;
}

export const ViewChildModal: React.FC<ViewChildModalProps> = ({ isOpen, onClose, child }) => {
    const [actionPlans, setActionPlans] = useState<any[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

    // Fetch action plans dynamically when the modal opens
    useEffect(() => {
        if (isOpen && child?._id) {
            setIsLoadingPlans(true);
            getChildActionPlans(child._id)
                .then(plans => {
                    setActionPlans(plans);
                    setIsLoadingPlans(false);
                })
                .catch(err => {
                    console.error("Failed to load plans", err);
                    setIsLoadingPlans(false);
                });
        }
    }, [isOpen, child]);

    // If modal is closed or child is missing, render nothing
    if (!isOpen || !child) return null;

    const age = new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 md:p-8 animate-in fade-in">
            {/* Modal Container */}
            <div className="bg-zinc-50 w-full max-w-5xl max-h-full rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 relative">

                {/* 📌 Floating Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-zinc-600 transition-all shadow-sm font-bold"
                >
                    ✕
                </button>

                {/* 📌 Modal Body (Scrollable) */}
                <div className="overflow-y-auto p-6 md:p-10 flex flex-col gap-6">

                    <ProfileHeader child={child} id={child._id} />

                    {isLoadingPlans ? (
                        <div className="p-10 text-center text-zinc-500 animate-pulse bg-white rounded-2xl border border-zinc-200">
                            Loading Action Plans...
                        </div>
                    ) : (
                        <ActionPlanSection
                            childId={child._id}
                            serializedTasks={actionPlans}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailCard title="Basic Info & Education">
                            <DataRow label="Age" value={`${age} years`} />
                            <DataRow label="DOB" value={new Date(child.dateOfBirth).toLocaleDateString()} />
                            <DataRow label="Gender" value={child.gender} />
                            <div className="mt-4 pt-4 border-t border-zinc-100">
                                <DataRow label="School" value={child.schoolName || 'N/A'} />
                                <DataRow label="Grade" value={child.gradeLevel || 'N/A'} />
                            </div>
                        </DetailCard>

                        <DetailCard title="Health & Background">
                            <DataRow label="Blood Type" value={child.bloodType || 'Unknown'} color="text-rose-600 font-bold" />
                            <DataRow label="Allergies" value={child.allergies || 'None'} />
                            <p className="text-sm text-zinc-600 mt-2"><strong>Medical Notes:</strong> {child.medicalNotes || 'None'}</p>
                            <div className="mt-4 pt-4 border-t border-zinc-100">
                                <DataRow label="Arrival" value={child.arrivalCategory?.replace("_", " ")} />
                                <p className="text-sm mt-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100 italic">"{child.arrivalDetails}"</p>
                            </div>
                        </DetailCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                        <ProfileDocumentVault childId={child._id} existingDocs={child.documents} />
                        <ProfilePhotoGallery childId={child._id} existingPhotos={child.gallery} />
                    </div>
                </div>
            </div>
        </div>
    );
};