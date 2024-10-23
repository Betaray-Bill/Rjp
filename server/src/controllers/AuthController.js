import Employee from "../models/EmployeeModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateEmpToken, generateToken } from "../utils/generateToken.js";


// Login
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email }).select("-password");
    console.log(req.body)
    if (employee) {
        console.log(employee.role.name)
        if (employee.role.name === "ADMIN") {
            console.log("EMp ROle specs : ", employee.manageEmployees)
        }

        // if(employee.role.name === "ADM)
        let token = generateEmpToken(res, employee._id);
        console.log("login token ", token);
        res.status(200).json({
            employee
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

// Update the Profile


// SignOut - GET - /signout
const signOut = asyncHandler(async(req, res) => {
    res.clearCookie('empToken').status(200).json('Signout success!');
})


export {
    login,
    signOut
}