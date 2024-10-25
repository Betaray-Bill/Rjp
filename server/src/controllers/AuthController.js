import Employee from "../models/EmployeeModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import KeyAccounts from "../models/RoleModels/KeyAccountsModel.js";
import Manager from "../models/RoleModels/ManagerModel.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateEmpToken, generateToken } from "../utils/generateToken.js";

// Login
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const employee = await Employee
        .findOne({ email })
        .select("-password");
    console.log(req.body)


    let rolesExtract = employee.role
    let rolesDetails = []
    for (let i = 0; i < rolesExtract.length; i++) {
        console.log(rolesExtract[i].name)
        if (rolesExtract[i].name === "ADMIN") {
            let roleData = await Admin.findById(rolesExtract[i].roleId)
            console.log("EMp ROle specs : ", roleData)
            rolesDetails.push(roleData)
        }
        if (rolesExtract[i].name === "Trainer Sourcer") {
            let roleData = await TrainerSourcer.findById(rolesExtract[i].roleId)
            console.log("EMp ROle specs : ", roleData)
            rolesDetails.push(roleData)
        }
        if (rolesExtract[i].name === "Manager") {
            let roleData = await Manager.findById(rolesExtract[i].roleId)
            console.log("EMp ROle specs : ", roleData)
            rolesDetails.push(roleData)
        }
        if (rolesExtract[i].name === "KeyAccounts") {
            let roleData = await KeyAccounts.findById(rolesExtract[i].roleId)
            console.log("EMp ROle specs : ", roleData)
            rolesDetails.push(roleData)
        }
    }

    // Manually populate each role based on the role name
    // const populatedRoles = await Promise.all(employee.role.map(async(role) => {
    //     let Model;

    //     // Determine which model to use based on role.name
    //     switch (role.name) {
    //         case 'ADMIN':
    //             Model = Admin; // Assuming Admin is a Mongoose model
    //             break;
    //         case 'Manager':
    //             Model = Manager; // Assuming Manager is a Mongoose model
    //             break;
    //         case 'Trainer Sourcer':
    //             Model = TrainerSourcer // Assuming TrainerSourcer is a Mongoose model
    //             break;
    //         case 'KeyAccounts':
    //             Model = KeyAccounts; // Assuming KeyAccounts is a Mongoose model
    //             break;
    //         default:
    //             return role; // If no match, return the role as is
    //     }

    //     // Find the document for the given roleId
    //     const populatedRole = await Model.findById(role.roleId);
    //     return {
    //         ...role,
    //         roleId: populatedRole, // Replace roleId with the populated document
    //     };
    // }))

    if (employee) {
        console.log(employee.role.name)
        if (employee.role.name === "ADMIN") {
            console.log("EMp ROle specs : ", employee.manageEmployees)
        }

        // if(employee.role.name === "ADM)
        let token = generateEmpToken(res, employee._id);
        console.log("login token ", token);
        res
            .status(200)
            .json({ employee, rolesDetails });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

// Update the Profile SignOut - GET - /signout
const signOut = asyncHandler(async(req, res) => {
    res
        .clearCookie('empToken')
        .status(200)
        .json('Signout success!');
})

export { login, signOut }