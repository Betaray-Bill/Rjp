import { Employee, Role } from "../models/EmployeeModel.js";
import ApiError from "../utils/ApiError.js";
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

        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const existingEmp = await Employee.findOne({ email: email })
        console.log(existingEmp)
        if (existingEmp) {
            return res.status(500).json({ message: 'Employee already exist' });
        }

        const employee = new Employee({
            name,
            email,
            password,
            role: role._id,
            authorizations,
        })
        console.log(1)

        try {
            console.log(2)
            await employee.save();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: 'Employee added successfully', employee });
    } catch (error) {
        throw new ApiError(500, error)
    }
})







export {
    createRole,
    addEmployee
}