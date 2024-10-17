export const userAccess = (roles, userRoles) => {

    // Check if the roles is accessible
    for (let i = 0; i < roles.length; i++) {
        for (let j = 0; j < userRoles?.length; j++) {
            if (userRoles[j].name === roles[i]) {
                return true
            }
        }
    }
    return false
}