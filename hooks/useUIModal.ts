"use client";
import { useModal } from "@/providers/ModalsManager";

export function useUIModals() {
    const { openModal, closeModal } = useModal();

    return {
        //guardian
        openGuardianModal: (data?: any) =>
            openModal("GUARDIAN_FORM", {
                mode: data ? "EDIT" : "ADD",
                initialData: data
            }),
        openGuardianDossier: (guardianId: string) =>
            openModal("GUARDIAN_DOSSIER", {
                id: guardianId
            }),
        openAssignChildrenModal: (guardianId: string,) => {
            openModal("ASSIGN_CHILD", {
                guardianId,
            })
        },
        openModifyPlacementsModal: (guardian: any) =>
            openModal("MODIFY_PLACEMENTS", { guardian }),

        //child
        openChildModal: (data?: any) =>
            openModal("CHILD_FORM", {
                mode: data ? "EDIT" : "ADMIT",
                initialData: data
            }),
        openChildActions: (childId: string) => {
            openModal("CHILD_ACTION", { childId })
        },
        openChildProfile: (child: any) => {
            openModal("CHILD_PROFILE", { child })
        },
        //staff
        openStaffForm: (staff?: any) => {
            openModal("STAFF_FORM", { initialData: staff })
        },

        //transaction
        openTransactionForm: (initialData?: any) => {
            openModal("TRANSACTION_FORM", { initialData: initialData })
        },
        openAccountHeadForm: ( initialData?: any) => {
            openModal("ACCOUNT_HEAD_FORM", { initialData: initialData })
        },

        closeModal
    };


}