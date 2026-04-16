import dynamic from "next/dynamic";

export const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
    GUARDIAN_FORM: dynamic(() => import("./guardians/GuardianModal").then(mod => mod.GuardianModal)),
    GUARDIAN_DOSSIER: dynamic(() => import("./guardians/GuardianDossierModal").then(mod => mod.GuardianDossierModal)),
    ASSIGN_CHILD: dynamic(() => import("./guardians/AssignChildModal").then(mod => mod.AssignChildModal)),
    MODIFY_PLACEMENTS: dynamic(() => import("./guardians/ModifyPlacements").then(mod => mod.ModifyPlacementsModal)),

    CHILD_FORM: dynamic(() => import("./child/ChildForm").then(mod => mod.ChildForm)),
    CHILD_ACTION: dynamic(() => import("./child/ChildAction").then(mod => mod.ChildAction)),
    CHILD_PROFILE: dynamic(() => import("./child/ViewChildModal").then(mod => mod.ChildDossierModal)),

    STAFF_FORM: dynamic(() => import("./staff/StaffForm").then(mod => mod.StaffForm)),

    TRANSACTION_FORM:dynamic(() => import("./finances/transaction/TransactionForm").then(mod => mod.TransactionForm)),
    ACCOUNT_HEAD_FORM:dynamic(() => import("./finances/accountHead/AccountHeadForm").then(mod => mod.AccountHeadForm)),

};