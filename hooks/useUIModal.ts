"use client";
import { useModal } from "@/providers/ModalsManager";

export function useUIModals() {
    const { openModal, closeModal } = useModal();

    return {
        openGuardianModal: (data?: any) =>
            openModal("GUARDIAN_FORM", {
                mode: data ? "EDIT" : "ADD",
                initialData: data
            }),
        openGuardianDossier: (guardianId: string) =>
            openModal("GUARDIAN_DOSSIER", {
                id: guardianId
            }),

        openChildModal: (data?: any) =>
            openModal("CHILD_FORM", {
                mode: data ? "EDIT" : "ADMIT",
                initialData: data
            }),
        openAssignChildrenModal: (guardianId: string,) => {
            openModal("ASSIGN_CHILD", {
                guardianId,
            })
        },
        openModifyPlacementsModal: (guardian: any) =>
            openModal("MODIFY_PLACEMENTS", { guardian }),

        openChildActions: (childId: string) => {
            openModal("CHILD_ACTION", { childId })
        },
        openChildProfile: (child: any) => {
            openModal("CHILD_PROFILE", { child })
        },


        closeModal
    };


}