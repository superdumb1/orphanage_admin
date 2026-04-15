import { GuardianModal } from "./guardians/GuardianModal";
import { GuardianDossierModal } from "./guardians/GuardianDossierModal";
import { AssignChildModal } from "./guardians/AssignChildModal"; 

export const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
    GUARDIAN_FORM: GuardianModal,
    GUARDIAN_DOSSIER: GuardianDossierModal,
    ASSIGN_CHILD: AssignChildModal, 
};