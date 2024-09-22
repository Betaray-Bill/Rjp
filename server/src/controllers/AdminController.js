import Employee from "../models/EmployeeModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


// Admin Add Role
// const createRole = asyncHandler(async(req, res) => {
//     try {
//         const { name, permissions } = req.body;

//         const role = new Role({
//             name,
//             permissions
//         });

//         await role.save();
//         res.status(201).json({ message: 'Role created successfully', role });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating role', error });
//     }
// })

// Admin adds an employee
const addEmployee = asyncHandler(async(req, res) => {
    try {
        const { name, email, password, role, authorizations } = req.body;
        // const adminId = req.user._id; 


        const existingEmp = await Employee.findOne({ email: email })
        console.log(existingEmp)
        if (existingEmp) {
            return res.status(500).json({ message: 'Employee already exist' });
        }
        console.log(req.body)
        const employee = new Employee({
            name,
            email,
            password,
            role: {
                name: role
            },
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

// Update the role

const updateEmployeeRole = asyncHandler(async(req, res) => {

    // Get the Id of the Emp

    // Check if the Employee Exist

    // Update the Role of the Emp

    // Save the employee
})

// Create Deal




export {
    updateEmployeeRole,
    addEmployee
}