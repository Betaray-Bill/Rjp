import Employee from "../models/EmployeeModel.js"

const authorizeRole = (...allowedRoles) => {
    return async (req, res, next) => {
        console.log("REQ", req.user);
        try {
            const employee = await Employee.findById(req.user._id);
            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }

            // Get Allowed Roles List
            const roles = [];
            for (let role of allowedRoles) {
                for (let item in role) {
                    roles.push(role[item]);
                }
            }

            // Check if User has the required role
            for (let role of roles) {
                for (let i = 0; i < req.user.role.length; i++) {
                    if (req.user.role[i].name === role) {
                        console.log("Authorized:", req.user.role[i].name);
                        return next(); // Exit middleware immediately
                    }
                }
            }

            // If no role matches, send a 403 response
            return res.status(403).json({ message: "Access denied" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
        }
    };
};

export default authorizeRole;