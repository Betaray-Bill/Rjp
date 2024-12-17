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
import Project from "../models/ProjectModel/ProjectModel.js";

// Get Revenue by Employees
const getRevenueByEmployees = asyncHandler(async(req, res) => {
    try {
        const employeeId = req.params.employeeId;
        console.log(employeeId);
        // Fetch the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        const adminRole = employee.role.find(r => r.name === "ADMIN");
        const keyAccountsRole = employee.role.find(r => r.name === "KeyAccounts");

        let projects;

        if (adminRole) {
            // If ADMIN, fetch all projects
            projects = await Project.find();
            console.log("Projects ", projects)
        } else if (keyAccountsRole) {
            // If KeyAccounts, fetch projects linked to their role
            const projectIds = keyAccountsRole.projectIds; // Assuming this holds an array of project IDs
            projects = await Project.find({ _id: { $in: projectIds } });
        } else {
            throw new Error("Employee role does not have access to projects");
        }


        // Calculate the total revenue for each project
        const projectRevenue = projects.map(project => {
            // check if the Invoice is sent 


            // total amount
            const totalAmount = Number(project.amount) || 0;
            console.log("totalAmount ", totalAmount)

            // Calculate total expenses
            const totalExpenses = Object.values(project.expenses || {}).reduce((sum, expense) => {
                return sum + (Number(expense.amount) || 0);
            }, 0);
            console.log("totalAmount ", totalAmount)

            // Net revenue calculation
            const netRevenue = totalAmount - totalExpenses;

            return {
                projectId: project._id,
                projectName: project.projectName,
                totalAmount,
                totalExpenses,
                netRevenue
            };
        });

        // Return response
        return res.status(200).json(projectRevenue)

    } catch (err) {

        return res
            .status(500)
            .json({ message: 'Error getting revenue by employees.', error: err.message });
    }
})







export {
    getRevenueByEmployees
}