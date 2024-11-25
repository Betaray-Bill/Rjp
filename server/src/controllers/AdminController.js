// import Company from "../models/CompanyAndDealModels/CompanyModel.js";
import Employee from "../models/EmployeeModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import Finance from "../models/RoleModels/FinanceModel.js";
import KeyAccounts from "../models/RoleModels/KeyAccountsModel.js";
import Manager from "../models/RoleModels/ManagerModel.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import { Trainer } from "../models/TrainerModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin Add Role const createRole = asyncHandler(async(req, res) => {     try {
//         const { name, permissions } = req.body;         const role = new
// Role({             name,             permissions         });         await
// role.save();         res.status(201).json({ message: 'Role created
// successfully', role });     } catch (error) {         res.status(500).json({
// message: 'Error creating role', error });     } }) Admin adds an employee -
// Register
const addEmployee = asyncHandler(async(req, res) => {
    try {
        const { name, email, password, roles } = req.body;

        // Check if the employee already exist
        const existingEmp = await Employee.findOne({ email: email })
        console.log(existingEmp)
        if (existingEmp) {
            return res
                .status(500)
                .json({ message: 'Employee already exist' });
        }

        // Get all the roles

        let employee;
        try {
            employee = new Employee({ name, email, password, role: [] })
            await employee.save();
            console.log(employee)

            // Get all the roles - check as per the role and create doc
            for (const role of roles) {
                // const { roleName } = role;
                console.log(roles)
                if (role === 'ADMIN') {
                    console.log(roles)
                    const adminRole = new Admin({ employeeId: employee._id });
                    await adminRole.save();
                    Employee
                        .role
                        .push({ roleId: adminRole._id, name: 'ADMIN' });
                } else if (role === 'Finance') {
                    console.log(roles)
                    const financeRole = new Finance({ employeeId: employee._id });
                    await financeRole.save();
                    employee
                        .role
                        .push({ roleId: financeRole._id, name: 'Finance' });
                } else if (role === 'Trainer Sourcer') {
                    const trainerSourcerRole = new TrainerSourcer({ employeeId: employee._id });
                    await trainerSourcerRole.save();
                    employee
                        .role
                        .push({ roleId: trainerSourcerRole._id, name: 'Trainer Sourcer' });
                } else if (role === 'KeyAccounts') {
                    console.log(role)
                    const keyAccountRole = new KeyAccounts({ employeeId: employee._id });
                    await keyAccountRole.save();
                    employee
                        .role
                        .push({ roleId: keyAccountRole._id, name: 'KeyAccounts' });
                }
            }

            await employee.save();
        } catch (err) {
            return res
                .status(500)
                .json({ message: err.message });
        }
        res
            .status(201)
            .json({ message: 'Employee added successfully', employee });
    } catch (error) {
        throw new ApiError(500, error)
    }
})

// Get ALl employes
const getAllEmployees = asyncHandler(async(req, res) => {
    try {
        const employees = await Employee
            .find()
            .select('-password');
        res.json(employees);
    } catch (error) {
        throw new ApiError(500, error)
    }
})

// Get Single employee
const getEmployeeById = asyncHandler(async(req, res) => {
    try {
        const employees = await Employee
            .find({ email: req.body.email })
            .select('email name _id');
        res.json(employees);
    } catch (error) {
        throw new ApiError(500, error)
    }
})

// Update the role
const updateEmployeeRole = asyncHandler(async(req, res) => {
    // Get Roles
    const { roles } = req.body;
    console.log(req.body)

    // Get the Id of the Emp
    const employeeId = req.params.empId
    try {
        // Check if the Employee Exist
        const employee = await Employee.findById(employeeId)
        console.log("Emp", employee)
        if (!employee) {
            return res
                .status(500)
                .json({ message: 'Employee does not exist' });
        }

        // Check if the Roles are not invalid
        if (roles === undefined || roles === null || roles.length == 0) {
            return res
                .status(400)
                .json({ message: 'Roles are required' });
        }

        // Check if the Employee is already assigned with this role
        for (let role of roles) {
            for (let roleName in employee.role) {
                if (role === employee.role[roleName].name) {
                    return res
                        .status(400)
                        .json({ message: 'Employee is already assigned with this role' });
                }
            }
        }


        // Update the Role of the Emp by checking which role need to be added
        for (const role of roles) {
            // const { roleName } = role;
            console.log(roles)
            if (role === 'ADMIN') {
                const adminRole = new Admin({ employeeId: Employee._id });
                await adminRole.save();
                employee
                    .role
                    .push({ roleId: adminRole._id, name: 'ADMIN' });
            } else if (role === 'Manager') {
                const managerRole = new Manager({ employeeId: employee._id });
                await managerRole.save();
                employee
                    .role
                    .push({ roleId: managerRole._id, name: 'Manager' });
            } else if (role === 'Trainer Sourcer') {
                const trainerSourcerRole = new TrainerSourcer({ employeeId: employee._id });
                await trainerSourcerRole.save();
                console.log("Trainer Srccc ", trainerSourcerRole)
                employee
                    .role
                    .push({ roleId: trainerSourcerRole._id, name: 'Trainer Sourcer' });
            } else if (role === 'KeyAccounts') {
                console.log(role)
                const keyAccountRole = new KeyAccounts({ employeeId: employee._id });
                await keyAccountRole.save();
                employee
                    .role
                    .push({ roleId: keyAccountRole._id, name: 'KeyAccounts' });
            }
        }

        await employee.save();
        res.status(201)
            .json({ employee });
    } catch (err) {
        return res.status(500)
            .json({ message: 'Error Adding ROle ', error: err.message });
    }
    // Save the employee
})


// Get All Trainers

const getAllTrainers = asyncHandler(async(req, res) => {
    try {
        // Find all trainers and project only name and _id fields
        const trainers = await Trainer.find();

        if (!trainers || trainers.length === 0) {
            return res
                .status(404)
                .json({ message: "No trainers found" });
        }

        res
            .status(200)
            .json({ message: "Trainers retrieved successfully", trainers });
    } catch (error) {
        console.error("Error retrieving trainers:", error);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }
})

// Create Deal

export {
    updateEmployeeRole,
    addEmployee,
    getAllTrainers,
    getAllEmployees,
    getEmployeeById
}