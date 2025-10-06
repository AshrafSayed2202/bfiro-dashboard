export const checkRole = (user, role) => {
    // Always return true if user has admin role (1)
    if (user.roles.includes(1)) {
        return true;
    }

    // Handle array of roles
    if (Array.isArray(role)) {
        return role.some(r => user.roles.includes(r));
    }

    // Handle single role
    return user.roles.includes(role);
};