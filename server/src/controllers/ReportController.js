import Employee from "../models/EmployeeModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import Finance from "../models/RoleModels/FinanceModel.js";
import KeyAccounts from "../models/RoleModels/KeyAccountsModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import Project from "../models/ProjectModel/ProjectModel.js";
import { Company } from "../models/CompanyAndDealModels/CompanyModel.js";
import { Trainer } from "../models/TrainerModel.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import mongoose from "mongoose";
import { stages } from "../utils/constants.js";


// Get Revenue by Employees
const getRevenueByEmployees = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const { startDate, endDate, company } = req.query;

        // Fetch the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const adminRole = employee.role.find((r) => r.name === "ADMIN");
        const keyAccountsRole = employee.role.find((r) => r.name === "KeyAccounts");

        let projects;
        const query = {};

        // Apply date filtering logic
        if (startDate && endDate) {
            // Both startDate and endDate are provided
            query['trainingDates.startDate'] = { $gte: new Date(startDate) };
            query['trainingDates.endDate'] = { $lte: new Date(endDate) };
        } else if (startDate) {
            // Only startDate is provided
            query['trainingDates.startDate'] = { $gte: new Date(startDate) };
        } else if (endDate) {
            // Only endDate is provided
            // query['trainingDates.startDate'] = { $lte: new Date(endDate) };
            query['trainingDates.endDate'] = { $lte: new Date(endDate) };
        }

        // Apply company filtering if provided
        if (company) {
            query['company.name'] = company;
        }

        // Only fetch projects with invoices sent to clients
        query['clientDetails.invoiceSentClient'] = true;

        if (adminRole) {
            // If the employee is an ADMIN, fetch all projects with filters applied
            projects = await Project.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'employees', // Collection name for employees
                        localField: 'projectOwner',
                        foreignField: '_id',
                        as: 'ownerDetails',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        projectName: 1,
                        amount: 1,
                        expenses: 1,
                        startDate: '$trainingDates.startDate', // Alias nested field
                        endDate: '$trainingDates.endDate', // Alias nested field
                        companyName: '$company.name', // Alias nested field
                        modeOfTraining: 1,
                        trainingName: 1,
                        'ownerDetails.name': 1,
                    },
                },
            ]);
        } else if (keyAccountsRole) {
            // If KeyAccounts, fetch projects mapped to this role with filters applied
            const keyAccounts = await KeyAccounts.findById(keyAccountsRole.roleId);
            if (!keyAccounts) {
                return res.status(404).json({ message: "KeyAccounts role data not found" });
            }

            projects = await Project.aggregate([
                {
                    $match: {
                        $and: [
                            { _id: { $in: keyAccounts.Projects } }, // Match specific project IDs
                            query, // Apply date and company filters
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'projectOwner',
                        foreignField: '_id',
                        as: 'ownerDetails',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        projectName: 1,
                        amount: 1,
                        expenses: 1,
                        startDate: '$trainingDates.startDate', // Alias nested field
                        endDate: '$trainingDates.endDate', // Alias nested field
                        companyName: '$company.name', // Alias nested field
                        modeOfTraining: 1,
                        trainingName: 1,
                        'ownerDetails.name': 1,
                    },
                },
            ]);
        } else {
            return res.status(403).json({ message: "Employee role does not have access to projects." });
        }

        // Calculate the total revenue for each project
        const projectRevenue = projects.map((project) => {
            const totalAmount = Number(project.amount) || 0;
            const totalExpenses = Object.values(project.expenses || {}).reduce(
                (sum, expense) => sum + (Number(expense.amount) || 0),
                0
            );

            const netRevenue = totalAmount - totalExpenses;

            return {
                projectId: project._id,
                projectName: project.projectName,
                trainingName: project.trainingName,
                startDate: project.startDate,
                endDate: project.endDate,
                companyName: project.companyName,
                modeOfTraining: project.modeOfTraining,
                totalAmount,
                totalExpenses,
                netRevenue,
            };
        });

        return res.status(200).json(projectRevenue);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error getting revenue by employees.",
            error: err.message,
        });
    }
});

// Get Revenue by CLients
const getRevenueByClients = asyncHandler(async (req, res) => {
    try {
        const company = req.params.company;
        console.log(company);

        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        // Fetch the company by name (case-insensitive)
        const client = await Company.findOne({
            companyName: {
                $regex: new RegExp(`^${company}$`, 'i'),
            },
        });
        if (!client) {
            console.log("Error");
            throw new Error("Company not found");
        }
        console.log(client);

        let query = { 'clientDetails.invoiceSentClient': true };

        // Apply date filtering logic
        if (startDate && endDate) {
            // Both startDate and endDate are provided
            query['trainingDates.startDate'] = { $gte: new Date(startDate) };
            query['trainingDates.endDate'] = { $lte: new Date(endDate) };
        } else if (startDate) {
            // Only startDate is provided
            query['trainingDates.startDate'] = { $gte: new Date(startDate) };
        } else if (endDate) {
            // Only endDate is provided
            // query['trainingDates.startDate'] = { $lte: new Date(endDate) };
            query['trainingDates.endDate'] = { $lte: new Date(endDate) };
        }

        const projects = await Project.aggregate([
            {
                $match: {
                    'company.name': {
                        $regex: new RegExp(`^${company}$`, 'i'),
                    },
                    ...query,
                },
            },
            {
                $lookup: {
                    from: 'employees', // Collection name for employees
                    localField: 'projectOwner',
                    foreignField: '_id',
                    as: 'ownerDetails',
                },
            },
            {
                $project: {
                    _id: 1,
                    projectName: 1,
                    amount: 1,
                    expenses: 1,
                    startDate: '$trainingDates.startDate', // Alias the nested field
                    endDate: '$trainingDates.endDate', // Alias the nested field
                    companyName: '$company.name', // Alias the nested field
                    trainingName: 1,
                    modeOfTraining: 1,
                    'ownerDetails.name': 1,
                },
            },
        ]);

        console.log("Projects: ", projects);

        const projectsRevenue = projects.map((project) => {
            const totalAmount = Number(project.amount) || 0;
            const totalExpenses = Object.values(project.expenses || {}).reduce(
                (sum, expense) => sum + (Number(expense.amount) || 0),
                0
            );

            const netRevenue = totalAmount - totalExpenses;

            return {
                projectId: project._id,
                projectName: project.projectName,
                trainingName: project.trainingName,
                startDate: project.startDate,
                endDate: project.endDate,
                companyName: project.companyName,
                modeOfTraining: project.modeOfTraining,
                totalAmount,
                totalExpenses,
                netRevenue,
            };
        });

        return res.status(200).json(projectsRevenue);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error getting revenue by clients.", error: err.message });
    }
});


// Payment Due
const paymentDuePayable = asyncHandler(async (req, res) => {
    try {
        // Get employee ID, startDate, and endDate from request
        const employeeId = req.params.employeeId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        console.log(req.query)

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        // Fetch the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        // Check roles
        const adminRole = employee.role.find((r) => r.name === "ADMIN");
        const keyAccountsRole = employee.role.find((r) => r.name === "KeyAccounts");

        let projects = [];

        if (adminRole) {
            // If Admin, fetch all projects
            projects = await Project.aggregate([
                {
                    $lookup: {
                        from: "employees",
                        localField: "projectOwner",
                        foreignField: "_id",
                        as: "ownerDetails",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        amount: 1,
                        expenses: 1,
                        projectName: 1,
                        trainingDates: 1,
                        "ownerDetails.name": 1,
                    },
                },
            ]);
        } else if (keyAccountsRole) {
            // If KeyAccounts, fetch projects only from their own KeyAccounts model
            const keyAccounts = await KeyAccounts.findById(keyAccountsRole.roleId).populate("projects");
            if (!keyAccounts) {
                throw new Error("KeyAccounts role data not found");
            }

            projects = keyAccounts.projects;
        } else {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        // Unpaid expenses within the due date range
        console.log(projects.map((e) => e.expenses))
        const dueExpenses = projects.flatMap((project) => {
            const dueEntries = [];
        
            // Check if project.expenses is valid before iterating
            if (!project.expenses || typeof project.expenses !== "object") {
                return dueEntries; // Return an empty array for this project if expenses are invalid
            }
        
            for (const [expenseName, expenseDetails] of Object.entries(project.expenses)) {
                if (
                    expenseDetails &&
                    !expenseDetails.isPaid &&
                    expenseDetails.dueDate &&
                    new Date(expenseDetails.dueDate) >= new Date(startDate) &&
                    new Date(expenseDetails.dueDate) <= new Date(endDate)
                ) {
                    dueEntries.push({
                        projectName: project.projectName,
                        projectOwner: project.ownerDetails?.[0]?.name || "Unknown",
                        expenseName,
                        amount: expenseDetails.amount,
                        dueDate: expenseDetails.dueDate,
                        status: "Due",
                    });
                }
            }
        
            return dueEntries;
        });
        
        // Overdue expenses (due date has passed)
        const overdueExpenses = projects.flatMap((project) => {
            const overdueEntries = [];
            if(project.expenses){
                for (const [expenseName, expenseDetails] of Object.entries(project.expenses)) {
                    if (
                        expenseDetails &&
                        !expenseDetails.isPaid &&
                        expenseDetails.dueDate &&
                        new Date(expenseDetails.dueDate) < new Date() // Past due date
                    ) {
                        overdueEntries.push({
                            projectName: project.projectName,
                            projectOwner: project.ownerDetails?.[0]?.name || "Unknown",
                            expenseName,
                            amount: expenseDetails.amount,
                            dueDate: expenseDetails.dueDate,
                            status: "Overdue",
                        });
                    }
                }
            }
            return overdueEntries;
        });

        // Combine due and overdue expenses
        const allExpenses = [...dueExpenses, ...overdueExpenses];

        return res.status(200).json(allExpenses);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error getting dues", error: err.message });
    }
});

// Payment Receivable
const paymentDueReceivable = asyncHandler(async (req, res) => {
    try {
        // Get employee ID, startDate, and endDate from request
        const employeeId = req.params.employeeId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        // Fetch the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        // Check roles
        const adminRole = employee.role.find((r) => r.name === "ADMIN");
        const keyAccountsRole = employee.role.find((r) => r.name === "KeyAccounts");

        let projects = [];

        if (adminRole) {
            // If Admin, fetch all projects
            projects = await Project.aggregate([
                {
                    $lookup: {
                        from: "employees",
                        localField: "projectOwner",
                        foreignField: "_id",
                        as: "ownerDetails",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        projectName: 1,
                        clientDetails: 1,
                        "company.name": 1,
                    },
                },
            ]);
        } else if (keyAccountsRole) {
            // If KeyAccounts, fetch projects only from their own KeyAccounts model
            const keyAccounts = await KeyAccounts.findById(keyAccountsRole.roleId).populate("projects");
            if (!keyAccounts) {
                throw new Error("KeyAccounts role data not found");
            }

            projects = keyAccounts.projects;
        } else {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        // Check for client payments due within the due date range or overdue
        const duePayments = projects.flatMap((project) => {
            const paymentEntries = [];
            const clientDetails = project.clientDetails;

            if (clientDetails) {
                const isWithinRange =
                    startDate &&
                    endDate &&
                    clientDetails.dueDate &&
                    new Date(clientDetails.dueDate) >= new Date(startDate) &&
                    new Date(clientDetails.dueDate) <= new Date(endDate);

                const isOverdue =
                    clientDetails.dueDate && new Date(clientDetails.dueDate) < new Date() && !clientDetails.invoiceSentClient;

                if ((isWithinRange || isOverdue) && !clientDetails.invoiceSentClient) {
                    paymentEntries.push({
                        projectName: project.projectName,
                        dueDate: clientDetails.dueDate,
                        amount: clientDetails.amount,
                        companyName: project.company?.name || "Unknown",
                        status: isOverdue ? "Overdue" : "Due",
                    });
                }
            }

            return paymentEntries;
        });

        return res.status(200).json(duePayments);
    } catch (err) {
        return res.status(500).json({ message: "Error getting receivables", error: err.message });
    }
});

// Forecast
const Forecast = async (req, res) => {
    try {
        // Fetch projects in the specified stage and filter by 'won' and 'open'
        const projects = await Project.find({
            stages: stages.OPEN__WON_LOST,
            lost_won_open_status: { $in: ['won', 'open'] }, // Filter for 'won' and 'open' statuses
        }).select("projectName company.name amount trainingDates lost_won_open_status"); // Select required fields only
        console.log("-----------------")
        console.log(projects)
        // Separate projects into 'won' and 'open'
        const wonProjects = projects.filter(project => project.lost_won_open_status === 'won');
        const openProjects = projects.filter(project => project.lost_won_open_status === 'open');

        // Format the response
        res.status(200).json({
            success: true,
            data: {
                won: wonProjects.map(project => ({
                    trainingName: project.projectName,
                    companyName: project.company?.name,
                    amount: project.amount,
                    trainingDates: project.trainingDates,
                })),
                open: openProjects.map(project => ({
                    trainingName: project.projectName,
                    companyName: project.company?.name,
                    amount: project.amount,
                    trainingDates: project.trainingDates,
                })),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving projects.",
            error: error.message,
        });
    }
};


// training Dates
const trainingCalendar = asyncHandler(async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    console.log(req.query, employeeId);

    // Fetch the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    const adminRole = employee.role.find((r) => r.name === "ADMIN");
    const keyAccountsRole = employee.role.find((r) => r.name === "KeyAccounts");

    let projects;
    let query = {};

    // Adjust the query based on the provided dates
    if (startDate && endDate) {
      query = {
        'trainingDates.startDate': { $gte: new Date(startDate) },
        'trainingDates.endDate': { $lte: new Date(endDate) },
      };
    } else if (startDate) {
      query = {
        'trainingDates.startDate': { $gte: new Date(startDate) },
      };
    } else if (endDate) {
      query = {
        'trainingDates.endDate': { $lte: new Date(endDate) },
      };
    }

    if (adminRole) {
      console.log("ADMIN");
      console.log(query);

      // If ADMIN, fetch all projects
      projects = await Project.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'employees', // Collection name for employees
            localField: 'projectOwner',
            foreignField: '_id',
            as: 'ownerDetails',
          },
        },
        {
          $project: {
            _id: 1,
            amount: 1,
            projectName: 1,
            trainingDates: 1,
            'ownerDetails.name': 1,
            'company.name': 1,
          },
        },
      ]);
      console.log(projects);
    } else if (keyAccountsRole) {
      // If KeyAccounts, fetch projects linked to their role
      const keyAccounts = await KeyAccounts.findById(keyAccountsRole.roleId);

      projects = await Project.aggregate([
        {
          $match: {
            $and: [
              { _id: { $in: keyAccounts.Projects } }, // Match specific project IDs
              query, // Include the date filter query
            ],
          },
        },
        {
          $lookup: {
            from: 'employees', // Collection name for employees
            localField: 'projectOwner',
            foreignField: '_id',
            as: 'ownerDetails',
          },
        },
        {
          $project: {
            _id: 1,
            amount: 1,
            expenses: 1,
            projectName: 1,
            trainingDates: 1,
            'company.name': 1,
            'ownerDetails.name': 1,
            'ownerDetails.email': 1,
          },
        },
      ]);
    } else {
      throw new Error("Employee role does not have access to projects");
    }

    return res.status(200).json(projects);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting projects by training calendar.", error: err.message });
  }
});

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
        query['clientDetails.invoiceSentClient'] = true

        // Add date filtering to the query
        // Apply date filtering logic
        if (startDate && endDate) {
            // Both startDate and endDate are provided
            query['trainingDates.startDate'] = { $gte: new Date(startDate) };
            query['trainingDates.endDate'] = { $lte: new Date(endDate) };
        } else if (startDate) {
            // Only startDate is provided
            query['trainingDates.startDate'] = { $gte: new Date(startDate) };
        } else if (endDate) {
            // Only endDate is provided
            // query['trainingDates.startDate'] = { $lte: new Date(endDate) };
            query['trainingDates.endDate'] = { $lte: new Date(endDate) };
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

// Pending Pending PO
const pendingPO = asyncHandler(async(req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ message: "Start date and end date are required." });
        }

        // Parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Build query with date filtering
        const query = {};
        query['trainingDates.startDate'] = {
            $gte: start,
            $lte: end
        };
        query['trainingDates.endDate'] = {
            $gte: start,
            $lte: end
        };

        // Fetch projects within the specified dates
        const projects = await Project.find(query);

        console.log("Projects: " + projects)

        const result = [];

        for (const project of projects) {
            console.log(`Processing project: ${project.projectName}`);

            const pendingTrainers = project
                .trainers
                .filter(trainer => {
                    // Skip if no purchaseOrder exists
                    if (!trainer.purchaseOrder || trainer.purchaseOrder.length === 0)
                        return true;

                    // Check if any PO is incomplete
                    return trainer
                        .purchaseOrder
                        .some(po => {
                            const { type, description, terms } = po.details || {};
                            return !type || !description || description.length === 0 || !terms || terms.length === 0;
                        });
                });

            console.log(`Pending Trainers: ${JSON.stringify(pendingTrainers, null, 2)}`);

            // Push relevant trainer data into result array
            for (const trainer of pendingTrainers) {
                const trainerDetails = await Trainer
                    .findById(trainer.trainer._id)
                    .select('generalDetails.name');

                // Add to result if trainer details exist
                if (trainerDetails) {
                    result.push({
                        projectId: project._id,
                        projectName: project.projectName,
                        trainerName: trainerDetails.generalDetails.name || 'Unknown',
                        projectOwner: await Employee
                            .findById(project.projectOwner)
                            .select('name') || 'Unknown'
                    });
                }
            }
        }

        console.log(result)

        return res.json(result);
    } catch (error) {
        console.error('Error fetching trainers with pending POs:', error);
        return res
            .status(500)
            .json({ message: "Internal server error." });
    }
})

// Pending Payment
const pendingPayment = asyncHandler(async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Parse dates if provided
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // Build query with flexible date filtering
        const query = {};

        if (start && end) {
            // Both startDate and endDate provided
            query['trainingDates.startDate'] = { $lte: end }; // Ensure training started before or on the endDate
            query['trainingDates.endDate'] = { $gte: start }; // Ensure training ended after or on the startDate
        } else if (start) {
            // Only startDate provided
            query['trainingDates.endDate'] = { $gte: start }; // Fetch all projects with training ending after or on the startDate
        } else if (end) {
            // Only endDate provided
            query['trainingDates.startDate'] = { $lte: end }; // Fetch all projects with training starting before or on the endDate
        }

        // Fetch projects based on the query
        const projects = await Project.find(query);

        const result = [];

        for (const project of projects) {
            const { projectName, projectOwner, _id: projectId } = project;

            for (const trainerObj of project.trainers) {
                // Check if any invoice in the trainer object is unpaid
                const unpaidInvoices = trainerObj.inVoice.filter(
                    (invoice) =>
                        !invoice.isPaid &&
                        (start || end || new Date(invoice.dueDate) < new Date()) // Include overdue invoices by default
                );

                for (const invoice of unpaidInvoices) {
                    const dueDate = new Date(invoice.dueDate);

                    // Handle date filtering logic
                    const isWithinRange =
                        (!start || dueDate >= start) && (!end || dueDate <= end);
                    const isOverdue = dueDate < new Date();

                    if (isWithinRange || isOverdue) {
                        // Fetch trainer details
                        const trainerDetails = await Trainer.findById(
                            trainerObj.trainer._id
                        ).select('generalDetails.name');

                        if (trainerDetails) {
                            const ownerDetails = await Employee.findById(projectOwner).select('name');

                            result.push({
                                trainingName: projectName,
                                trainerName: trainerDetails.generalDetails.name || 'Unknown',
                                projectOwner: ownerDetails?.name || 'Unknown',
                                projectId: projectId.toString(),
                                dueDate: invoice.dueDate || 'Not available',
                                status: isOverdue ? 'Overdue' : 'Pending',
                            });
                        }
                    }
                }
            }
        }

        return res.json(result);
    } catch (error) {
        console.error('Error fetching trainers with due payments:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


// Search Trainer By name, gmail, Id
const searchTrainer = async(req, res) => {
    try {
        const { query } = req.query;

        // Ensure query is provided
        if (!query) {
            return res
                .status(400)
                .json({ message: "Search query is required." });
        }

        // MongoDB search with regex for case-insensitive partial matches
        const results = await Trainer.find({
            $or: [{
                "generalDetails.name": {
                    $regex: query,
                    $options: "i"
                }
            }, {
                trainerId: {
                    $regex: query,
                    $options: "i"
                }
            }, {
                "generalDetails.email": {
                    $regex: query,
                    $options: "i"
                }
            }]
        }).select("generalDetails.name trainerId generalDetails.email");

        return res
            .status(200)
            .json(results);
    } catch (error) {
        console.error("Error searching trainers:", error);
        res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};

//  Get trainer Dates
const getTrainerDates = async(req, res) => {
    try {
        const { trainerId } = req.params;

        if (!trainerId) {
            return res
                .status(400)
                .json({ message: "Trainer ID is required." });
        }

        // Find the trainer by ID
        const trainer = await Trainer
            .findOne({ trainerId })
            .populate({
                path: "projects", // Assuming projects is an array of ObjectIds in the trainer schema
                select: "projectName trainingDates", // Only fetch projectName and trainingDates
            })
            .select("generalDetails.name trainerId workingDates projects");

        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found." });
        }

        res
            .status(200)
            .json(trainer);
    } catch (error) {
        console.error("Error fetching trainer details:", error);
        res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};

const trainersSourced = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const employeeId = req.params.employeeId;

    try {
        const employee = await Employee.findById(employeeId).select("name role");
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        const isAdmin = employee.role.some(r => r.name === "ADMIN");
        const isTrainerSourcer = employee.role.some(r => r.name === "Trainer Sourcer");

        if (!isAdmin && !isTrainerSourcer) {
            return res.status(403).json({ message: "Employee role does not have access to trainers." });
        }

        let trainers = [];

        const dateMatch = {};
        if (startDate) dateMatch["trainingDates.startDate"] = { $gte: new Date(startDate) };
        if (endDate) {
            dateMatch["trainingDates.endDate"] = { ...dateMatch["trainingDates.endDate"], $lte: new Date(endDate) };
        }

        if (isAdmin) {
            const adminRole = employee.role.find(r => r.name === "ADMIN");
            const admin = await Admin.findById(adminRole.roleId).populate({
                path: "registeredTrainers",
                select: { generalDetails: 1, trainerId: 1 },
            });

            if (!admin) {
                return res.status(404).json({ message: "Admin data not found." });
            }

            const registeredTrainers = admin.registeredTrainers.map(tr => tr._id);

            const result = await Project.aggregate([
                { $match: { "trainers.trainer": { $in: registeredTrainers }, ...dateMatch, "trainers.isFinalized": true } },
                { $unwind: "$trainers" },
                { $match: { "trainers.trainer": { $in: registeredTrainers }, "trainers.isFinalized": true } },
                { $group: { _id: "$trainers.trainer" } },
            ]);

            trainers = result.map(r => r._id);
        } else if (isTrainerSourcer) {
            const trainerSourcerRole = employee.role.find(r => r.name === "Trainer Sourcer");
            const trainerSourcer = await TrainerSourcer.findById(trainerSourcerRole.roleId).populate({
                path: "registeredTrainers",
                select: { generalDetails: 1, trainerId: 1 },
            });

            if (!trainerSourcer) {
                return res.status(404).json({ message: "Trainer Sourcer data not found." });
            }

            const registeredTrainers = trainerSourcer.registeredTrainers.map(tr => tr._id);

            const result = await Project.aggregate([
                { $match: { "trainers.trainer": { $in: registeredTrainers }, ...dateMatch, "trainers.isFinalized": true } },
                { $unwind: "$trainers" },
                { $match: { "trainers.trainer": { $in: registeredTrainers }, "trainers.isFinalized": true } },
                { $group: { _id: "$trainers.trainer" } },
            ]);

            trainers = result.map(r => r._id);
        }

        return res.status(200).json({ message: "Trainers sourced successfully.", trainers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error.", error: err.message });
    }
});

// Trainer Sourcer No of trainer methods Sourced in a period
const trainersDeployed = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const employeeId = req.params.employeeId;

    try {
        const employee = await Employee.findById(employeeId).select("name role");
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        const isAdmin = employee.role.some(r => r.name === "ADMIN");
        const isTrainerSourcer = employee.role.some(r => r.name === "Trainer Sourcer");

        if (!isAdmin && !isTrainerSourcer) {
            return res.status(403).json({ message: "Employee role does not have access to trainers." });
        }

        let totalTrainersDeployed = 0;

        const dateMatch = {};
        if (startDate) dateMatch["trainingDates.startDate"] = { $gte: new Date(startDate) };
        if (endDate) {
            dateMatch["trainingDates.endDate"] = { ...dateMatch["trainingDates.endDate"], $lte: new Date(endDate) };
        }

        if (isAdmin) {
            const adminRole = employee.role.find(r => r.name === "ADMIN");
            const admin = await Admin.findById(adminRole.roleId).populate({
                path: "registeredTrainers",
                select: { generalDetails: 1, trainerId: 1 },
            });

            if (!admin) {
                return res.status(404).json({ message: "Admin data not found." });
            }

            const registeredTrainers = admin.registeredTrainers.map(tr => tr._id);

            const result = await Project.aggregate([
                { $match: { "trainers.trainer": { $in: registeredTrainers }, ...dateMatch } },
                { $unwind: "$trainers" },
                { $match: { "trainers.trainer": { $in: registeredTrainers }, "trainers.isFinalized": true } },
                { $group: { _id: null, totalTrainers: { $sum: 1 } } },
            ]);

            totalTrainersDeployed = result.length > 0 ? result[0].totalTrainers : 0;
        } else if (isTrainerSourcer) {
            const trainerSourcerRole = employee.role.find(r => r.name === "Trainer Sourcer");
            const trainerSourcer = await TrainerSourcer.findById(trainerSourcerRole.roleId).populate({
                path: "registeredTrainers",
                select: { generalDetails: 1, trainerId: 1 },
            });

            if (!trainerSourcer) {
                return res.status(404).json({ message: "Trainer Sourcer data not found." });
            }

            const registeredTrainers = trainerSourcer.registeredTrainers.map(tr => tr._id);

            const result = await Project.aggregate([
                { $match: { "trainers.trainer": { $in: registeredTrainers }, ...dateMatch } },
                { $unwind: "$trainers" },
                { $match: { "trainers.trainer": { $in: registeredTrainers }, "trainers.isFinalized": true } },
                { $group: { _id: null, totalTrainers: { $sum: 1 } } },
            ]);

            totalTrainersDeployed = result.length > 0 ? result[0].totalTrainers : 0;
        }

        return res.status(200).json({ message: "Total trainers deployed successfully.", totalTrainersDeployed });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error.", error: err.message });
    }
});

// Trainer wise report
const trainerRevenueReport = asyncHandler(async(req, res) => {
    const { startDate, endDate } = req.query;
    const trainerId = req.params.trainerId;
    try {
        // if (!startDate || !endDate) {
        //     return res
        //         .status(400)
        //         .json({ message: "Start date and end date are required." });
        // }

        // Parse the dates for filtering
        const start = new Date(startDate);
        const end = new Date(endDate);
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
        query['clientDetails.invoiceSentClient'] = true

        // Find the trainer by ID
        const trainer = await Trainer.aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(trainerId),
                },
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "projects",
                    foreignField: "_id",
                    as: "projects",
                },
            },
            {
                $addFields: {
                    projects: {
                        $filter: {
                            input: "$projects",
                            as: "project",
                            cond: {
                                $or: [{
                                        $and: [
                                            { $gte: ["$$project.trainingDates.startDate", start] },
                                            { $lte: ["$$project.trainingDates.startDate", end] },
                                        ],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$$project.trainingDates.endDate", start] },
                                            { $lte: ["$$project.trainingDates.endDate", end] },
                                        ],
                                    },
                                    {
                                        $and: [
                                            { $lte: ["$$project.trainingDates.startDate", start] },
                                            { $gte: ["$$project.trainingDates.endDate", end] },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    projects: {
                        $map: {
                            input: "$projects",
                            as: "project",
                            in: {
                                projectId: "$$project._id",
                                projectName: "$$project.projectName",
                                company: "$$project.company.name",
                                projectStartDate: "$$project.trainingDates.startDate",
                                projectEndDate: "$$project.trainingDates.endDate",
                                amount: "$$project.amount",
                                totalExpenses: {
                                    $sum: [
                                        "$$project.expenses.Trainer.amount",
                                        "$$project.expenses.Venue.amount",
                                        "$$project.expenses.Travel.amount",
                                        "$$project.expenses.Boarding_Lodging.amount",
                                        "$$project.expenses.cw_lab.amount",
                                        "$$project.expenses.miscellaneous.amount",
                                    ],
                                },
                                profit: {
                                    $subtract: [
                                        "$$project.amount",
                                        {
                                            $sum: [
                                                "$$project.expenses.Trainer.amount",
                                                "$$project.expenses.Venue.amount",
                                                "$$project.expenses.Travel.amount",
                                                "$$project.expenses.Boarding_Lodging.amount",
                                                "$$project.expenses.cw_lab.amount",
                                                "$$project.expenses.miscellaneous.amount",
                                            ],
                                        },
                                    ],
                                },
                                trainingDays: {
                                    $dateDiff: {
                                        startDate: "$$project.trainingDates.startDate",
                                        endDate: "$$project.trainingDates.endDate",
                                        unit: "day",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    projects: 1,
                },
            },
        ]);


        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found." });
        }

        return res.status(200).json(trainer)

    } catch (err) {
        console.error("Error parsing dates:", err);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
})

export {
    getRevenueByEmployees,
    getRevenueByClients,
    trainingCalendar,
    Forecast,
    getTrainingDetailsByKAM,
    pendingPayment,
    pendingPO,
    searchTrainer,
    trainersSourced,
    getTrainerDates,
    trainersDeployed,
    paymentDuePayable,
    paymentDueReceivable,
    trainerRevenueReport
}