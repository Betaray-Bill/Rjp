import Employee from "../models/EmployeeModel.js";
const checkRoleStatus = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      // Find the employee by their ID
      const employee = await Employee.findById(req.user._id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Check if at least one required role is assigned and enabled
      let hasValidRole = false;
      for (let i = 0; i < employee.role.length; i++) {
        for (let j = 0; j < requiredRoles.length; j++) {
          if (requiredRoles[j] === employee.role[i].name && !employee.role[i].disable) {
            hasValidRole = true;
            return next(); // Call next() and exit immediately if a valid role is found
          }
        }
      }

      // If no valid role is found, return a 403 response
      if (!hasValidRole) {
        return res
          .status(403)
          .json({ message: "Access denied. No valid active role found." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error in role status" });
    }
  };
};


export default checkRoleStatus;
