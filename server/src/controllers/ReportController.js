import Employee from "../models/EmployeeModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import Finance from "../models/RoleModels/FinanceModel.js";
import KeyAccounts from "../models/RoleModels/KeyAccountsModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import Project from "../models/ProjectModel/ProjectModel.js";
import { Company } from "../models/CompanyAndDealModels/CompanyModel.js";

// Get Revenue by Employees
const getRevenueByEmployees = asyncHandler(async(req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const company = req.query.company;

        // Fetch the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        const adminRole = employee
            .role
            .find(r => r.name === "ADMIN");
        const keyAccountsRole = employee
            .role
            .find(r => r.name === "KeyAccounts");

        let projects;
        let query = {};

        // Add date filtering to the query
        if (startDate && endDate) {
            query['trainingDates.startDate'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
            query['trainingDates.endDate'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Add company filtering to the query if a company is passed
        if (company) {
            query['company.name'] = company;
        }

        query['invoiceSentClient'] = true

        if (adminRole) {
            // If ADMIN, fetch all projects but filter by company if provided
            projects = await Project.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: 'employees', // Collection name for employees
                    localField: 'projectOwner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            }, {
                $project: {
                    _id: 1,
                    amount: 1,
                    expenses: 1,
                    projectName: 1,
                    trainingDates: 1,
                    'company.name': 1,
                    'ownerDetails.name': 1
                }
            }]);
        } else if (keyAccountsRole) {
            // If KeyAccounts, fetch projects mapped to this employee and filter by company
            const keyAccounts = await KeyAccounts.findById(keyAccountsRole.roleId);

            if (!keyAccounts) {
                throw new Error("KeyAccounts role data not found");
            }

            // Only include projects linked to this KeyAccounts role and filter by company
            projects = await Project.aggregate([{
                $match: {
                    $and: [{
                            _id: {
                                $in: keyAccounts.Projects
                            }
                        }, // Match specific project IDs
                        query // Include the date and company filter query
                    ]
                }
            }, {
                $lookup: {
                    from: 'employees', // Collection name for employees
                    localField: 'projectOwner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            }, {
                $project: {
                    _id: 1,
                    amount: 1,
                    expenses: 1,
                    projectName: 1,
                    trainingDates: 1,
                    'company.name': 1,
                    'ownerDetails.name': 1
                }
            }]);
        } else {
            throw new Error("Employee role does not have access to projects");
        }

        // Calculate the total revenue for each project
        const projectRevenue = projects.map(project => {
            const totalAmount = Number(project.amount) || 0;
            const totalExpenses = Object
                .values(project.expenses || {})
                .reduce((sum, expense) => {
                    return sum + (Number(expense.amount) || 0);
                }, 0);

            const netRevenue = totalAmount - totalExpenses;

            return {
                projectId: project._id,
                projectName: project.projectName,
                totalAmount,
                totalExpenses,
                companyName: project.company.name,
                netRevenue
            };
        });

        return res
            .status(200)
            .json(projectRevenue);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error getting revenue by employees.", error: err.message });
    }
});

// Get Revenue by CLients
const getRevenueByClients = asyncHandler(async(req, res) => {
    try {
        const company = req.params.company;
        console.log(company);

        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        // Fetch the company by name (case-insensitive)
        const client = await Company.findOne({
            companyName: {
                $regex: new RegExp(`^${company}$`, 'i')
            }
        });
        if (!client) {
            console.log("Error");
            throw new Error("Company not found");
        }
        console.log(client);

        let query = {};
        query['invoiceSentClient'] = true

        if (startDate && endDate) {
            query = {
                'trainingDates.startDate': {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                'trainingDates.endDate': {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        const projects = await Project.aggregate([{
            $match: {
                'company.name': {
                    $regex: new RegExp(`^${company}$`, 'i')
                },
                ...query
            }
        }, {
            $lookup: {
                from: 'employees', // Collection name for employees
                localField: 'projectOwner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        }, {
            $project: {
                _id: 1,
                amount: 1,
                expenses: 1,
                projectName: 1,
                trainingDates: 1,
                'company.name': 1,
                'ownerDetails.name': 1
            }
        }]);

        console.log("Projects: ", projects);

        const projectsRevenue = projects.map((project) => {
            const totalAmount = Number(project.amount) || 0;
            const totalExpenses = Object
                .values(project.expenses || {})
                .reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);

            const netRevenue = totalAmount - totalExpenses;

            return {
                projectId: project._id,
                projectName: project.projectName,
                totalAmount,
                totalExpenses,
                companyName: project.company.name,
                netRevenue
            };
        });

        return res
            .status(200)
            .json(projectsRevenue);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error getting revenue by clients.", error: err.message });
    }
});

// Training Calendar
const trainingCalendar = asyncHandler(async(req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        console.log(req.query, employeeId)

        // Fetch the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        const adminRole = employee
            .role
            .find(r => r.name === "ADMIN");
        const keyAccountsRole = employee
            .role
            .find(r => r.name === "KeyAccounts");

        let projects;
        let query = {};

        if (startDate && endDate) {
            query = {
                'trainingDates.startDate': {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                'trainingDates.endDate': {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        if (adminRole) {
            console.log("ADMIn")
                // If ADMIN, fetch all projects
            console.log(query)
            projects = await Project.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: 'employees', // Collection name for employees
                    localField: 'projectOwner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            }, {
                $project: {
                    _id: 1,
                    amount: 1,
                    projectName: 1,
                    trainingDates: 1,
                    'ownerDetails.name': 1,
                    'company.name': 1
                }
            }]);
            console.log(projects)
        } else if (keyAccountsRole) {
            // If KeyAccounts, fetch projects linked to their role
            const keyAccounts = await KeyAccounts.findById(keyAccountsRole.roleId);

            projects = await Project.aggregate([{
                $match: {
                    $and: [{
                            _id: {
                                $in: keyAccounts.Projects
                            }
                        }, // Match specific project IDs
                        query // Include the date filter query
                    ]
                }
            }, {
                $lookup: {
                    from: 'employees', // Collection name for employees
                    localField: 'projectOwner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            }, {
                $project: {
                    _id: 1,
                    amount: 1,
                    expenses: 1,
                    projectName: 1,
                    trainingDates: 1,
                    'company.name': 1,
                    'ownerDetails.name': 1,
                    'ownerDetails.email': 1

                }
            }]);
        } else {
            throw new Error("Employee role does not have access to projects");
        }

        return res
            .status(200)
            .json(projects);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error getting revenue by employees.", error: err.message });
    }
})

// Get KAM -> General Detail Reports
const getTrainingDetailsByKAM = asyncHandler(async(req, res) => {
    try {
        console.log("object")
        const employeeId = req.params.employeeId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const company = req.query.company;

        console.log(req.query)

        // Fetch the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        const adminRole = employee
            .role
            .find(r => r.name === "ADMIN");
        const keyAccountsRole = employee
            .role
            .find(r => r.name === "KeyAccounts");

        let projects;
        let query = {};
        query['invoiceSentClient'] = true

        // Add date filtering to the query
        if (startDate && endDate) {
            query['trainingDates.startDate'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
            query['trainingDates.endDate'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Add company filtering to the query if a company is passed
        if (company) {
            query['company.name'] = company;
        }

        if (adminRole) {
            // If ADMIN, fetch all projects but filter by company if provided
            projects = await Project.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: 'employees', // Collection name for employees
                    localField: 'projectOwner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            }, {
                $group: {
                    _id: "$company.name", // Group by the company name field
                    projectCount: {
                        $sum: 1
                    }, // Count the number of projects for each company
                    projects: {
                        $push: "$$ROOT"
                    } // Optionally, keep all projects in an array
                }
            }, {
                $project: {
                    _id: 1, // Include the company name
                    projectCount: 1, // Include the project count

                    'ownerDetails.name': 1,
                    'ownerDetails.email': 1,
                    projectNames: {
                        $map: {
                            input: "$projects",
                            as: "proj",
                            in: "$$proj.projectName"
                        }
                    } // Extract project names
                }
            }]);
        } else if (keyAccountsRole) {
            // If KeyAccounts, fetch projects mapped to this employee and filter by company
            const keyAccounts = await KeyAccounts.findById(keyAccountsRole.roleId);

            if (!keyAccounts) {
                throw new Error("KeyAccounts role data not found");
            }

            // Only include projects linked to this KeyAccounts role and filter by company
            projects = await Project.aggregate([{
                $match: {
                    $and: [{
                            _id: {
                                $in: keyAccounts.Projects
                            }
                        }, // Match specific project IDs
                        query // Include the date and company filter query
                    ]
                }
            }, {
                $lookup: {
                    from: 'employees', // Collection name for employees
                    localField: 'projectOwner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            }, {
                $group: {
                    _id: "$company.name", // Group by the company name field
                    projectCount: {
                        $sum: 1
                    }, // Count the number of projects for each company
                    projects: {
                        $push: "$$ROOT"
                    } // Optionally, keep all projects in an array
                }
            }, {
                $project: {
                    _id: 1, // Include the company name
                    projectCount: 1, // Include the project count

                    'ownerDetails.name': 1,
                    'ownerDetails.email': 1,
                    projectNames: {
                        $map: {
                            input: "$projects",
                            as: "proj",
                            in: "$$proj.projectName"
                        }
                    } // Extract project names
                }
            }]);
        } else {
            throw new Error("Employee role does not have access to projects");
        }

        return res
            .status(200)
            .json(projects);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error getting revenue by employees.", error: err.message });
    }
})

export { getRevenueByEmployees, getRevenueByClients, trainingCalendar, getTrainingDetailsByKAM }