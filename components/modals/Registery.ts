import { GuardianModal } from "./GuardianModal";
import { GuardianDossierModal } from "./GuardianDossierModal";

export const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
    GUARDIAN_FORM: GuardianModal, // The Add/Edit form
    GUARDIAN_DOSSIER: GuardianDossierModal, 
};