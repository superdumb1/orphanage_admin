export const ROLES = {
    ADMIN: 'ADMIN',
    SAMITY: 'SAMITY',
    STAFF: 'STAFF'
};

export function canApprove(userRole: string) {
    return userRole === ROLES.ADMIN;
}