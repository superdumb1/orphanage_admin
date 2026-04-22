"use client";
import { useModal } from "@/providers/ModalsManager";

export function useUIModals() {
    const { openModal, closeModal } = useModal();

    return {
        // --- GUARDIAN ---
        openGuardianModal: ({ data }: { data?: any } = {}) =>
            openModal(
                "GUARDIAN_FORM",
                !!data ? "Update Guardian" : "New Guardian Form",
                { initialData: data }
            ),

        openGuardianDossier: ({ guardianId }: { guardianId: string }) =>
            openModal(
                "GUARDIAN_DOSSIER",
                "Guardian Profile", // Fixed typo: "Guardain" -> "Guardian"
                { id: guardianId }
            ),

        openAssignChildrenModal: ({ guardianId }: { guardianId: string }) =>
            openModal(
                "ASSIGN_CHILD",
                "Assign Children",
                { guardianId }
            ),

        openModifyPlacementsModal: ({ guardian }: { guardian: any }) =>
            openModal(
                "MODIFY_PLACEMENTS",
                "Modify Placements",
                { guardian }
            ),

        // --- CHILD ---
        openChildModal: ({ data }: { data?: any } = {}) => {


            openModal(
                "CHILD_FORM",
                !!data ? "Update Child" : "Admit Child",
                { initialData: data }
            )
        },


        openChildActions: ({ childId }: { childId: string }) => {
            openModal(
                "CHILD_ACTION",
                "Child Action",
                { childId }
            )
        },

        openChildProfile: ({ child }: { child: any }) => {

            openModal(
                "CHILD_PROFILE",
                `${child.firstName}'s Profile`,
                { child }
            )
        },

        // --- STAFF ---
        openStaffForm: ({ staff }: { staff?: any } = {}) =>
            openModal(
                "STAFF_FORM",
                !!staff ? "Update Staff" : "Add New Staff",
                { initialData: staff }
            ),

        // --- TRANSACTION / FINANCE ---
        openTransactionForm: ({ initialData }: { initialData?: any } = {}) =>
            openModal(
                "TRANSACTION_FORM",
                !!initialData ? "Edit Transaction" : "New Transaction",
                { initialData }
            ),

        // ✨ THE FIX IS HERE: Added 'defaultType' to the parameters and the payload
        openAccountHeadForm: ({ initialData, isIncomeHead, defaultType }: { initialData?: any, isIncomeHead?: boolean, defaultType?: string } = {}) =>
            openModal(
                "ACCOUNT_HEAD_FORM",
                !!initialData ? "Edit Account Head" : "New Account Head",
                { initialData, isIncomeHead, defaultType }
            ),

        // --- INVENTORY ---
        openManageStock: ({ item }: { item: any }) =>
            openModal(
                "MANAGE_STOCK",
                `Manage Stock: ${item?.name || 'Item'}`,
                { item }
            ),

        openInventoryItemForm: ({ item }: { item?: any } = {}) =>
            openModal(
                "INVENTORY_ITEM_FORM",
                !!item ? "Update Inventory Item" : "New Inventory Item",
                { item }
            ),

        closeModal: () => closeModal()
    };
}