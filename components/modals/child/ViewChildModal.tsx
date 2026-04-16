"use client";

import React, { useEffect, useState } from "react";
import { DataRow, DetailCard } from "@/components/organisms/child/child-profile/DetailCard";
import { ProfileHeader } from "@/components/organisms/child/child-profile/ProfileHeader";
import { ActionPlanSection } from "@/components/organisms/child/child-profile/ActionPlanSection";
import { getChildActionPlans } from "@/app/actions/getChildActionPlans";
import {
  ProfileDocumentVault,
  ProfilePhotoGallery
} from "@/components/molecules/ProfileDocumentVault";
import { Activity } from "lucide-react";

export const ChildDossierModal = ({
    child,
    closeModal
}: {
    child: any;
    closeModal: () => void;
}) => {
    const [actionPlans, setActionPlans] = useState<any[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

    useEffect(() => {
        if (child?._id) {
            setIsLoadingPlans(true);
            getChildActionPlans(child._id)
                .then((plans) => {
                    setActionPlans(plans);
                    setIsLoadingPlans(false);
                })
                .catch((err) => {
                    console.error("Dossier Fault: Failed to load plans", err);
                    setIsLoadingPlans(false);
                });
        }
    }, [child]);

    if (!child) return null;

    const age = new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear();

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 01. HEADER PROTOCOL */}
            <div className="border-b border-border/50 pb-6">
                <ProfileHeader child={child} id={child._id} />
            </div>

            {/* 02. ACTIVE DIRECTIVES (ACTION PLANS) */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                    <Activity size={14} /> 01. Active Directives
                </h3>
                
                {isLoadingPlans ? (
                    <div className="p-10 flex flex-col items-center justify-center gap-4 bg-shaded/30 rounded-dashboard border border-border/50">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] animate-pulse">
                            Decrypting Directives...
                        </span>
                    </div>
                ) : (
                    <ActionPlanSection
                        childId={child._id}
                        serializedTasks={actionPlans}
                    />
                )}
            </div>

            {/* 03. SYSTEM TELEMETRY (DETAILS GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ACADEMIC & BIO */}
                <div className="bg-shaded/30 p-6 rounded-dashboard border border-border/50 shadow-inner flex flex-col h-full">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4 opacity-70">
                        Identity & Academic
                    </h4>
                    <div className="space-y-3 flex-1">
                        <DataRow label="Current Age" value={`${age} Years`} />
                        <DataRow label="D.O.B." value={new Date(child.dateOfBirth).toLocaleDateString()} />
                        <DataRow label="Gender" value={child.gender} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                        <DataRow label="Assigned Facility" value={child.schoolName || "N/A"} />
                        <DataRow label="Academic Level" value={child.gradeLevel || "N/A"} />
                    </div>
                </div>

                {/* MEDICAL & ORIGIN */}
                <div className="bg-shaded/30 p-6 rounded-dashboard border border-border/50 shadow-inner flex flex-col h-full">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4 opacity-70">
                        Health & Origin Protocol
                    </h4>
                    <div className="space-y-3 flex-1">
                        <DataRow label="Blood Type" value={child.bloodType || "Unknown"} color="text-danger font-black" />
                        <DataRow label="Allergies" value={child.allergies || "None Detected"} />
                        <div className="pt-2">
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-1">Medical Synopsis</span>
                            <p className="text-xs text-text bg-bg p-3 rounded-xl border border-border/50">
                                {child.medicalNotes || "No anomalies reported."}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                        <DataRow label="Arrival Context" value={child.arrivalCategory?.replace("_", " ")} />
                        <p className="text-[11px] mt-2 bg-bg p-3 rounded-xl border border-border/50 italic text-text-muted">
                            "{child.arrivalDetails || "Details pending classification."}"
                        </p>
                    </div>
                </div>

            </div>

            {/* 04. DIGITAL VAULTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                <ProfileDocumentVault
                    childId={child._id}
                    existingDocs={child.documents}
                />
                <ProfilePhotoGallery
                    childId={child._id}
                    existingPhotos={child.gallery}
                />
            </div>

            {/* AUDIT FOOTER */}
            <div className="pt-6 border-t border-border/30 opacity-40">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] text-center">
                    End of Record // Kree Corp Internal Child Protocol
                </p>
            </div>
        </div>
    );
};