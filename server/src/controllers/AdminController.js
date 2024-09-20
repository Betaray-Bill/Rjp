import { Employee, Role } from "../models/EmployeeModel.js";
import asyncHandler from "../utils/asyncHandler.js";


// Admin Add Role
const createRole = asyncHandler(async(req, res) => {
    try {
        const { name, permissions } = req.body;

        const role = new Role({
            name,
            permissions
        });

        await role.save();
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error });
    }
})

// Admin adds an employee
const addEmployee = asyncHandler(async(req, res) => {
    try {
        const { name, email, password, roleId, authorizations } = req.body;
        // const adminId = req.user._id; 
        console.log(req.body)
            // Find the role by ID
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        console.log("ROLE ", role)
            // Create new employee
        const employee = new Employee({
            name,
            email,
            password,
            role: role._id,
            authorizations, // Optional array of extra permissions
            // createdBy: adminId
        })
        await employee.populate('role');
        console.log(employee)
        await employee.save();
        res.status(201).json({ message: 'Employee added successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error });
    }
})







export {
    createRole,
    addEmployee
}