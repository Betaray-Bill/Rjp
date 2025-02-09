import Employee from "../models/EmployeeModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import Finance from "../models/RoleModels/FinanceModel.js";
import KeyAccounts from "../models/RoleModels/KeyAccountsModel.js";
import argon2 from 'argon2';
import Manager from "../models/RoleModels/ManagerModel.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateEmpToken, generateToken } from "../utils/generateToken.js";

// Login
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    console.log("Login Request for emp",req.body)

    const employee = await Employee.findOne({ email })
        // .select("password");
    console.log(req.body)

    if (employee && (await argon2.verify(employee.password, password))) {

        let rolesExtract = employee.role
        let rolesDetails = []
        for (let i = 0; i < rolesExtract.length; i++) {
            console.log(rolesExtract[i].name)
            if (rolesExtract[i].name === "ADMIN") {
                let roleData = await Admin.findById(rolesExtract[i].roleId)
                console.log("EMp ROle specs : ", roleData)
                rolesDetails.push(roleData)
            }
            if (rolesExtract[i].name === "TrainerSourcer") {
                let roleData = await TrainerSourcer.findById(rolesExtract[i].roleId)
                console.log("EMp ROle specs : ", roleData)
                rolesDetails.push(roleData)
            }
            if (rolesExtract[i].name === "Finance") {
                let roleData = await Finance.findById(rolesExtract[i].roleId)
                console.log("EMp ROle specs : ", roleData)
                rolesDetails.push(roleData)
            }
            if (rolesExtract[i].name === "KeyAccounts") {
                let roleData = await KeyAccounts.findById(rolesExtract[i].roleId)
                console.log("EMp ROle specs : ", roleData)
                rolesDetails.push(roleData)
            }
        }

        // Manually populate each role based on the role name const populatedRoles =
        // await Promise.all(employee.role.map(async(role) => {     let Model;     //
        // Determine which model to use based on role.name     switch (role.name) {
        //    case 'ADMIN':             Model = Admin; // Assuming Admin is a Mongoose
        // model             break;         case 'Manager':             Model = Manager;
        // // Assuming Manager is a Mongoose model             break;         case
        // 'Trainer Sourcer':             Model = TrainerSourcer // Assuming
        // TrainerSourcer is a Mongoose model             break;         case
        // 'KeyAccounts':             Model = KeyAccounts; // Assuming KeyAccounts is a
        // Mongoose model             break;         default:             return role;
        // // If no match, return the role as is     }     // Find the document for the
        // given roleId     const populatedRole = await Model.findById(role.roleId);
        // return {         ...role,         roleId: populatedRole, // Replace roleId
        // with the populated document     }; }))

        if (employee) {
            console.log(employee.role.name)
            if (employee.role.name === "ADMIN") {
                console.log("EMp ROle specs : ", employee.manageEmployees)
            }

            // if(employee.role.name === "ADM)
            let emp = employee._id
            let token = generateEmpToken(res, emp);
            console.log("login token ", token);
            console.log("login emp ", emp);
        
            res
                .status(200)
                .json({ employee, rolesDetails,token });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

// Change password
const updatePassword = asyncHandler(async(req, res) => {
    const empId = req.params.empId;
    const { currentPassword, newpassword } = req.body;
    console.log(empId);
    console.log(req.body)
    try {
        const employee = await Employee
            .findById(empId)
            .select('password');
        console.log(employee.password)
        if (!employee) {
            return res
                .status(404)
                .json({ message: 'employee not found' });
        }
        console.log(employee)
            // Check if the old password matches
        console.log("Pass ", employee)
        const isMatch = await argon2.verify(employee.password, currentPassword);
        console.log(isMatch)
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Old password is incorrect' });
        }
        console.log(1)
            // Hash the new password
        const hashedPassword = await argon2.hash(newpassword);
        console.log(2)

        // Update the password in the database
        employee.password = hashedPassword;
        await employee.save();

        res
            .status(200)
            .json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res
            .status(500)
            .json({ message: 'Error in changing the password' });
    }
});

// Update the Profile SignOut - GET - /signout
const signOut = asyncHandler(async(req, res) => {
    res
        .clearCookie('empToken')
        .status(200)
        .json('Signout success!');
})

export { login, signOut, updatePassword }