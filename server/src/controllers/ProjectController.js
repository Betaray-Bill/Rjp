import { Company } from "../models/CompanyAndDealModels/CompanyModel.js";
import Employee from "../models/EmployeeModel.js";
import Stages from "../models/Pipeline/StagesModel.js";
import Project from "../models/ProjectModel/ProjectModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import KeyAccounts from "../models/RoleModels/KeyAccountsModel.js";
import Manager from "../models/RoleModels/ManagerModel.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import { Resume, Trainer } from "../models/TrainerModel.js";
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
        projectOwner,
        contactDetails,
        domain,
        description,
        amount,
        trainingDates,
        modeOfTraining,
        employees,
        // stage:"Training Requirement"
    } = req.body;
    console.log(req.body)
    const stage = "Training Requirement"

    // Validate required fields
    if (!projectName || !domain || !company || !trainingDates || !modeOfTraining) {
        return res
            .status(400)
            .json({ message: "Required fields are missing." });
    }

    // Save the Project to the Company Check if company exists
    const companyExists = await Company.find({ companyName: company.name });
    console.log(companyExists)
    if (!companyExists) {
        return res
            .status(404)
            .json({ message: "Company not found." });
    }

    // Add the Project to the Stage
    const stagePipelineExists = await Stages.find({
        name: stage
    })



    // Save the Project
    try {
        const newProject = new Project({
            projectName,
            projectOwner,
            amount: Number(amount),
            company: {
                name: company.name,
                Company_id: company.id
            },
            contactDetails: {
                name: contactDetails.name,
                email: contactDetails.contactEmail,
                contactNumber: contactDetails.contactPhoneNumber
            },
            domain,
            description,
            trainingDates: {
                startDate: trainingDates.startDate,
                endDate: trainingDates.endDate,
                timing: trainingDates.timing
            },
            modeOfTraining,
            // 
        });

        await newProject.save();
        if(stagePipelineExists){
            await Stages.findByIdAndUpdate(stagePipelineExists[0]._id, {
                $push: {
                    projects: newProject._id
                }
            }, { new: true });
        }
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

        return res
            .status(200)
            .json({ message: 'Project created.', project: newProject });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: 'Error creating project.', error: err.message });
    }
})

// Get Projects from the Emp
const getProjectsByEmp = asyncHandler(async(req, res) => {
    const { empId } = req.params;
    const employee = await Employee.findById(empId)
    if (!employee) {
        return res
            .status(404)
            .json({ message: "Employee not found" });
    }

    let projects
    if (employee) {
        console.log("Inside EMp", employee.role)
            // get the TrainerSourcer Id and then push the trainers Id in the docs
        for (let i = 0; i < employee.role.length; i++) {
            console.log(employee.role[i].name)
            if (employee.role[i].name === 'KeyAccounts') {
                projects = await KeyAccounts
                    .findById(employee.role[i].roleId)
                    .select('Projects')
                    .populate({
                        path: 'Projects',
                        select: 'projectName domain company.name  projectOwner contactDetails.name contactDetails' +
                            '.email trainingDates', // Only fetch the 'name' field from each employee
                        // },
                    })
                    .populate({
                        path: 'Projects',
                        populate: {
                            path: "projectOwner",
                            select: 'name'
                        },
                        // select: 'name', // Only fetch the 'name' and 'role' fields
                    })

                console.log(projects)
                projects = projects.Projects
                    // await trainer.save()
                break;
            }

            if (employee.role[i].name == 'ADMIN') {
                console.log('Admin is present')
                projects = await Project.find()
                    // console.log(projects)
                    .populate({
                        path: 'projectOwner',
                        select: 'name'
                    })
                    // projects = await Admin
                    //     .findById(employee.role[i].roleId)
                    //     .select('Projects')
                    //     .populate({
                    //         path: 'Projects',
                    //         select: 'projectName domain company.name  projectOwner contactDetails.name contactDetails' +
                    //             '.email trainingDates', // Only fetch the 'name' field from each employee
                    //         // },
                    //     })
                    //     .populate({
                    //         path: 'Projects',
                    //         populate: {
                    //             path: "projectOwner",
                    //             select: 'name'
                    //         },
                    //         // select: 'name', // Only fetch the 'name' and 'role' fields
                    //     })
                res.json({ projects });
                break;
            }
        }
    }
    if (!projects) {
        return res
            .status(404)
            .json({ message: "No projects found" });
    }

    res.json({ projects });
})

// Get Projects By Id
const getProjectDetails = asyncHandler(async(req, res) => {
    const { projectId } = req.params;

    const project = await Project
        .findById(projectId)
        .populate({ path: 'projectOwner', select: 'name' })
        .populate({
            path: 'trainers.trainer',
            populate: {
                path: "resumeVersion"
            },
            select: 'generalDetails.name generalDetails.email trainingDetails.trainerType ', // Only fetch the 'name' and 'role' fields
        })
        .populate({
            path: 'trainers.resume',
            // select: 'domain'
        })

    // .populate('company.Company_id') .populate('employees')

    if (!project) {
        return res
            .status(404)
            .json({ message: "Project not found" });
    }

    res.json({ project });
})

// Append the trainers list in the Project
const addTrainer = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    // const { empId } = req.params;
    console.log("Add trainer")
        // Check if the Project exists
    const project = await Project.findById(projectId);
    if (!project) {
        return res
            .status(404)
            .json({ message: "Project not found" });
    }
    const trainersList = req.body.trainers;

    // Check if the trainers exist in the project
    const existingTrainers = project
        .trainers
        .filter(trainer => trainersList.includes(trainer.trainer.toString()));
    if (existingTrainers.length > 0) {
        return res
            .status(400)
            .json({ message: "Some trainers already exist in the project" });
    }

    // const trainersList = req.body.trainers;
    console.log(req.body)
    console.log(trainersList)
    try {

        // Update the Project's trainer section
        await Project.findByIdAndUpdate(projectId, {
            $addToSet: {
                'trainers': {
                    $each: trainersList.map(trainerId => ({ trainer: trainerId }))
                }

            }
        }, { new: true });

        console.log(project._id)
        for (let i = 0; i < trainersList.length; i++) {
            console.log("1", trainersList[i])
            await Trainer.findByIdAndUpdate(trainersList[i], {
                $addToSet: {
                    projects: project._id
                }
            }, { new: true });
            // console.log("Trainer updated", trainer)
        }

        res.json({ message: "Trainers added to the project." });
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: 'Error adding trainers.', error: err.message });

    }

})

// Delete Trainers from the project
const deleteTrainer = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    const trainersList = req.body.trainers;
    console.log(req.body)
    console.log(trainersList)

    try {

        console.log("1", trainersList)
        await Project.findByIdAndUpdate(projectId, {
            $pull: {
                trainers: {
                    trainer: trainersList
                }
            }
        }, { new: true });

        // console.log("Trainer Deleted", trainer)
        await Trainer.findByIdAndUpdate(trainersList, {
            $pull: {
                projects: projectId
            }
        }, { new: true });

        res.json({ message: "Trainers Deleted to the project." });
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: 'Error Deleting trainers.', error: err.message });

    }

})

// Add resume to the project
const addResumeToProject = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    const { resumeId } = req.body;
    const { trainerId } = req.params;
    console.log(projectId, trainerId, resumeId)
        // console.log("Add resume", req.body, req.params)

    try {
        // Update the Project's trainer section
        const project = await Project.findById(projectId)
            // console.log(project)

        for (let i = 0; i < project.trainers.length; i++) {
            console.log(project.trainers[i])
            if (project.trainers[i].trainer.toString() === trainerId) {
                console.log("Trainer found", project.trainers[i].trainer)
                project.trainers[i].resume = resumeId
                console.log(project.trainers[i].resume)
                await project.save()

                break
            }
        }
        console.log(project.trainers)
        await Resume.findByIdAndUpdate(resumeId, {
            $addToSet: {
                projects: project._id
            }
        }, { new: true })

        res.json({ message: "Trainers Resume  to the project." });
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: 'Error adding resume.', error: err.message });
    }

    // console.log(req.body) console.log(resume)
})

// update a project - ADMIN delete a project - ADMIN Add a trainer - KA, Admin
// delete a trainer - KA, Admin Add a Emp with role - Admin Delete a Emp with
// role - Admin

export {
    createProject,
    getProjectDetails,
    getProjectsByEmp,
    addTrainer,
    deleteTrainer,
    addResumeToProject
}