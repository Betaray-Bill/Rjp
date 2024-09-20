import { Employee, Role } from "../models/EmployeeModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";


// Register
// const register = asyncHandler(async(req, res) => {
//     const { name, email, password, roleId, authorizations } = req.body;
//     //console.log("email: ", email);

//     // if (
//     //     [name, email, password, roleId, authorizations].some((field) => field.trim() === "")
//     // ) {
//     //     throw new ApiError(400, "All fields are required")
//     // }

//     const existedUser = await Employee.findOne({
//         $or: [{ name }, { email }]
//     })

//     if (existedUser) {
//         throw new ApiError(409, "User with email or username already exists")
//     }

//     // Check if the Role exists
//     const role = await Role.find({
//         name: roleId
//     });

//     if (!role) {
//         throw new ApiError(404, "Role not found")
//     } else {
//         console.log(role)
//     }

//     const employee = new Employee({
//         name,
//         email,
//         password,
//         role: role._id,
//         authorizations, // Optional array of extra permissions
//         // createdBy: adminId
//     });

//     await employee.save();
//     res.status(200).json(
//         new ApiResponse(200, employee, "User registered Successfully")
//     );

// })


// Login
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email }).select("-password");

    if (employee && (await employee.matchPassword(password))) {
        let token = generateToken(res, employee._id);
        res.status(200).json({
            employee,
            token
        });
    } else {
        return res.status(500).json(
            new ApiError(500, "Invalid email or password")
        )
    }
})

// Admin creates a new role
const createRole = async(req, res) => {
    try {
        const { name, permissions } = req.body;
        console.log(req.body)
        const role = new Role({
            name,
            permissions // Array of permissions
        });

        await role.save();
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error });
    }
};

export {
    login,
    createRole
}