export type ModalType = 
  | "ADMIT_CHILD" 
  | "EDIT_STAFF" 
  | "DELETE_CONFIRM" 
  | "FINANCE_ENTRY" 
  | "VETTING_ACTION";

export interface ModalState {
  type: ModalType | null;
  props?: any; // Data passed to the modal (e.g., childId)
}