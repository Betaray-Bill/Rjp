import Company from "../models/CompanyAndDealModels/CompanyModel.js";
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

        // Check if the employee already exist
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

        try {
            await employee.save();
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: 'Employee added successfully', employee });
    } catch (error) {
        throw new ApiError(500, error)
    }
})

// Get ALl employes
const getAllEmployees = asyncHandler(async(req, res) => {
    try {
        const employees = await Employee.find().select('-password');
        res.json(employees);
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

// Create a Company - new Company for a deal
const createCompany = asyncHandler(async(req, res) => {
    const {
        companyName,
        contact_name,
        contact_email,
        contact_phone_number,
    } = req.body

    // check if the company exists
    const existingCompany = await Company.findOne({ companyName: companyName })
    if (existingCompany) {
        return res.status(400).json({ message: 'Company already exists' });
    }

    try {
        const company = new Company({
            companyName,
            contact_details: {
                contact_name,
                contact_email,
                contact_phone_number,
            }
        });

        await company.save();
        res.status(201).json({ message: 'Company created successfully', company, Created_By: req.user_id });
    } catch (err) {
        return res.status(500).json({ message: 'Error creating company', error: err.message });
    }

})

// Get Company Details By Id
const getCompanyDetails = asyncHandler(async(req, res) => {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    // .populate('Deals')
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
})

// Get All Company Name and Id
const getAllCompanyNamesAndIds = asyncHandler(async(req, res) => {
    // console.log(object)
    console.log("----------------------------------------------------------------")
    try {
        // Find all companies and project only name and _id fields
        const companies = await Company.find();
        console.log(companies)
        if (!companies || companies.length === 0) {
            return res.status(404).json({ message: "No companies found" });
        }

        res.status(200).json({
            message: "Companies retrieved successfully",
            companies
        });
    } catch (error) {
        console.error("Error retrieving companies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Create Deal




export {
    updateEmployeeRole,
    addEmployee,
    createCompany,
    getAllCompanyNamesAndIds,
    getCompanyDetails,
    getAllEmployees
}