import { Company } from "../models/CompanyAndDealModels/CompanyModel.js";
import Employee from "../models/EmployeeModel.js";
import Project from "../models/ProjectModel/ProjectModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import KeyAccounts from "../models/RoleModels/KeyAccountsModel.js";
import Manager from "../models/RoleModels/ManagerModel.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a New Project - KA, Admin
const createProject = asyncHandler(async(req, res) => {
    // get the EMP ID
    const empId = req.params.empId

    const employee = await Employee.findById(empId)
    if (!employee) {
        return res
            .status(404)
            .json({ message: "Employee not found" });
    }

    // if KeyAcc store it in his Docs, if Admin store it in his Doc also save the
    // project, before that get the contact person's id Save the Project in the Emp
    const {
        projectName,
        company,
        contactDetails,
        domain,
        description,
        trainingDates,
        modeOfTraining,
        employees
    } = req.body;
    console.log(req.body)

    // Validate required fields
    if (!projectName || !domain || !company || !trainingDates || !modeOfTraining) {
        return res.status(400).json({ message: "Required fields are missing." });
    }

    // Save the Project to the Company
    // Check if company exists
    const companyExists = await Company.find({ companyName: company.name });
    console.log(companyExists)
    if (!companyExists) {
        return res.status(404).json({ message: "Company not found." });
    }

    // Save the Project
    try {
        const newProject = new Project({
            projectName,
            company: {
                name: company.name,
                Company_id: company.id
            },
            contactDetails: {
                name: contactDetails.name,
                email: contactDetails.email,
                contactNumber: contactDetails.contactNumber
            },
            domain,
            description,
            trainingDates: {
                startDate: trainingDates.startDate,
                endDate: trainingDates.endDate,
                timing: trainingDates.timing
            },
            modeOfTraining,
            employees: employees
        });

        await newProject.save();
        console.log("Company ---------------------------- ", companyExists[0]._id)
            // Save the new Prj to the Company
        await Company.findByIdAndUpdate(companyExists[0]._id, {
            $push: {
                Projects: newProject._id
            }
        }, { new: true });
        console.log("company  ", companyExists)

        // Save the new Prj to the Emp who created...
        if (employee) {
            console.log("Inside EMp", employee.role)
                // get the TrainerSourcer Id and then push the trainers Id in the docs
            for (let i = 0; i < employee.role.length; i++) {
                console.log(employee.role[i].name)
                if (employee.role[i].name === 'KeyAccounts') {
                    console.log("Key acc    ")
                    await KeyAccounts.findByIdAndUpdate(employee.role[i].roleId, {
                        $push: {
                            Projects: newProject._id
                        }
                    }, { new: true });
                    break;
                }

                if (employee.role[i].name == 'ADMIN') {
                    console.log('Admin is present')
                    await Admin.findByIdAndUpdate(employee.role[i].roleId, {
                        $push: {
                            Projects: newProject._id
                        }
                    }, { new: true });
                    break;
                }
            }
        }

        await employee.save()

        // Save the Projects to the Other Emps

        return res.status(200).json({ message: 'Project created.', project: newProject });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error creating project.', error: err.message });
    }
})


// Get Projects By Id

const getProjectDetails = asyncHandler(async(req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
        .populate('company.Company_id')
        // .populate('employees')


    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
})

// update a project - ADMIN delete a project - ADMIN Add a trainer - KA, Admin



// delete a trainer - KA, Admin Add a Emp with role - Admin Delete a Emp with
// role - Admin

export {
    createProject,
    getProjectDetails
}