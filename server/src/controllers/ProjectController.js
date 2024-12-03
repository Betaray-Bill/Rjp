import { Company } from "../models/CompanyAndDealModels/CompanyModel.js";
import Employee from "../models/EmployeeModel.js";
import Pipeline from "../models/Pipeline/PipelineModel.js";
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

    // await stagePipelineExists Save the Project
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
                contactEmail: contactDetails.contactEmail,
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
        console.log(newProject._id)
            // Save it in the Pipeline Add the Project to the Stage const pipeline = await
            // Pipeline.getSingletonPipeline(); console.log(pipeline)
        const updatedPipeline = await Pipeline.findOneAndUpdate({
            // _id: pipeline._id,
            "stages.name": "Training Requirement"
        }, {
            $set: {
                "stages.$.projects": newProject._id
            }
        }, { new: true });

        if (!updatedPipeline) {
            throw new Error('Stage not found');
        }

        console.log("PipelIne ", updatedPipeline)

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
                try {
                    const projects = await Pipeline
                        .find()
                        .populate({
                            path: 'stages.projects', // Populate 'projects' within each stage
                            select: 'projectName domain company.name trainingDates', // Select specific fields from 'Project'
                            populate: {
                                path: 'projectOwner', // Populate the 'projectOwner' field within 'projects'
                                select: 'name contactDetails.email contactDetails.phone', // Select specific fields from 'projectOwner'
                            }
                        });

                    res.json({ projects });
                } catch (err) {
                    console.log(err.message);
                    return res
                        .status(404)
                        .json({ message: err });
                }
                // break;
            }

            if (employee.role[i].name == 'Finance') {
                console.log("KFInanace da", employee.role.populate('roleId'))
                const projects = await Pipeline.aggregate([{
                    $project: {
                        stages: {
                            $map: {
                                input: "$stages",
                                as: "stage",
                                in: {
                                    $cond: [{
                                            $in: [
                                                "$$stage.name", ["Payment", "PO received / Invoice Raised", "Invoice Sent"]
                                            ]
                                        },
                                        "$$stage", {
                                            name: "$$stage.name",
                                            projects: []
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }])
                console.log(projects)
                res.json({ projects: projects.stages });
                // assignedProjects = employee     .role[i]     .roleId     .Projects
                // .map((project) => project.toString()); console.log(assignedProjects)

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

// Get All Projects from pipeline
const getProject = asyncHandler(async(req, res) => {
    const empId = req.params.empId
    console.log("INsodee")
    const employee = await Employee
        .findById(empId)
        .populate('role.roleId')
    console.log("EMP", employee.role[0].roleId)

    // Extract the projects assigned to the employee
    let assignedProjects = []
    for (let i = 0; i < employee.role.length; i++) {
        console.log(employee.role[i].name)

        if (employee.role[i].name === 'KeyAccounts') {
            // console.log("Key acc", employee.role.populate('roleId'))
            assignedProjects = employee
                .role[i]
                .roleId
                .Projects
                .map((project) => project.toString());
            console.log(assignedProjects)

            break;
        }

        if (employee.role[i].name == 'ADMIN') {
            console.log('Admin is present')
            const projects = await Pipeline
                .find()
                .populate({
                    path: 'stages.projects', // Populate 'projects' within each stage
                    select: 'projectName domain company.name trainingDates', // Select specific fields from 'Project'
                    populate: {
                        path: 'projectOwner', // Populate the 'projectOwner' field within 'projects'
                        select: 'name contactDetails.email contactDetails.phone', // Select specific fields from 'projectOwner'
                    }
                });

            console.log(projects)
            res.json({ projects: projects[0].stages });

            break;
        }

        if (employee.role[i].name === 'Finance') {
            // // console.log("Key acc", employee.role.populate('roleId')) const projects =
            // await Pipeline.aggregate([{     $project: {         stages: { $map: { input:
            // "$stages",                 as: "stage",          in: { name: "$$stage.name",
            // projects: {                         $map: { input: "$$stage.projectDetails",
            // // Map over the projectDetails array as: "project",   in: { projectName:
            // "$$project.projectName",                domain: "$$project.domain", company:
            // "$$project.company.name", trainingDates: "$$project.trainingDates",
            // projectOwner: {  name: { $arrayElemAt: ["$$project.projectOwnerDetails.name",
            // 0] }, email: {       $arrayElemAt:
            // ["$$project.projectOwnerDetails.contactDetails.email", 0]                 },
            //                         phone: { $arrayElemAt:
            // ["$$project.projectOwnerDetails.contactDetails.phone", 0]           } }   }
            // // } //                     } // } //   } //         } //     } // }]);
            const pipelines = await Pipeline.find({}, "stages").populate({
                path: 'stages.projects', // Populate 'projects' within each stage
                select: 'projectName domain company.name trainingDates', // Select specific fields from 'Project'
                populate: {
                    path: 'projectOwner', // Populate the 'projectOwner' field within 'projects'
                    select: 'name contactDetails.email contactDetails.phone', // Select specific fields from 'projectOwner'
                }
            });;
            const projects = pipelines.map((pipeline) => {
                return {
                    ...pipeline,
                    stages: pipeline
                        .stages
                        .map((stage) => {
                            if (["Payment", "PO received / Invoice Raised", "Invoice Sent"].includes(stage.name)) {
                                return { name: stage.name, projects: stage.projects };
                            }
                            return {
                                name: stage.name,
                                projects: [] // Empty array for other stages
                            };
                        })
                };
            });

            console.log("PRojects ", projects)
            return res.json({ projects: projects[0].stages });
            // assignedProjects = employee     .role[i]     .roleId     .Projects
            // .map((project) => project.toString()); console.log(assignedProjects)

            break;
        }
    }
    try {
        const projects = await Pipeline
            .find()
            .populate({
                path: 'stages.projects', // Populate 'projects' within each stage
                select: 'projectName domain company.name trainingDates', // Select specific fields from 'Project'
                populate: {
                    path: 'projectOwner', // Populate the 'projectOwner' field within 'projects'
                    select: 'name contactDetails.email contactDetails.phone', // Select specific fields from 'projectOwner'
                }
            });
        // console.log("PRojectss ", projects[0].stages) Filter out projects not
        // assigned to the employee
        const filteredPipeline = projects[0]
            .stages
            .map((stage) => {
                // console.log(stage)
                const filteredProjects = stage
                    .projects
                    .filter((project) => assignedProjects.includes(project._id.toString()));
                return {
                    ...stage.toObject(),
                    projects: filteredProjects, // Replace with filtered projects
                };
            });

        console.log("FINAL ------------", filteredPipeline)

        res.json({ projects: filteredPipeline });
    } catch (err) {
        console.log(err.message);
        return res
            .status(404)
            .json({ message: err });
    }
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
            select: 'generalDetails.name generalDetails.address generalDetails.email trainingDetails.' +
                'trainerType bankDetails.gstNumber bankDetails.pancardNumber', // Only fetch the 'name' and 'role' fields
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

// Update Project Stage
const updateStage = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    const { stageName } = req.body;
    console.log("StageName ", stageName)
    const session = await Project.startSession(); // Use a session for transaction
    session.startTransaction();

    const project = await Project
        .findById(projectId)
        .session(session);
    if (!project) {
        throw new Error("Project not found");
    }

    try {
        // remove the project from prev stage
        const stage = await Pipeline.findOneAndUpdate({
            "stages.name": project.stages
        }, {
            $pull: {
                "stages.$.projects": project._id
            }
        }, {
            new: true,
            session
        });
        if (!stage) {
            throw new Error("Previous stage not found");
        }
        console.log("Stage is ", stage)

        // add it to new stage
        const newStage = await Pipeline.findOneAndUpdate({
            "stages.name": stageName
        }, {
            $push: {
                "stages.$.projects": project._id
            }
        }, {
            new: true,
            session
        });
        if (!newStage) {
            throw new Error("New stage not found");
        }

        // Update the stage in project
        await Project.findByIdAndUpdate(projectId, {
            $set: {
                stages: stageName
            }
        }, {
            new: true,
            session
        });

        await session.commitTransaction();
        session.endSession();

        res
            .status(200)
            .json({ message: "Stage updated successfully", project });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res
            .status(500)
            .json({ message: 'Error Updating Stage', error: err.message });

    }

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

// Is Client Call Done
const isClientCallDone = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    console.log(req.body)
    const { trainerId } = req.body
    try {
        const project = await Project.findById(projectId)
            // console.log(project)

        for (let i = 0; i < project.trainers.length; i++) {
            console.log(project.trainers[i])
            if (project.trainers[i].trainer.toString() === trainerId) {
                console.log("Trainer found", project.trainers[i].trainer)
                project.trainers[i].isClientCallDone = true
                    // console.log(project.trainers[i].resume)
                await project.save()

                break
            }
        }
        res.json({ message: " Done" });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: 'Error adding resume.', error: err.message });
    }

})

// Add Chat to the Project
const addChatToProject = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    console.log(req.body)

    try {
        await Project.findByIdAndUpdate(projectId, {
            $push: {
                'notes': req.body
            }
        }, { new: true })

        res.json({ message: "Successfully Added" });
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: 'Error adding note.', error: err.message });
    }
    // console.log("Add chat", req.body, req.params)
})

// Get All notes
const getAllNotes = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId)
        if (!project) {
            return res
                .status(404)
                .json({ message: "Project not found" });
        }
        console.log(project.notes)
        res.json({ notes: project.notes });
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error getting notes." });
    }
})

// CHecklist in training Delivery
const checkListUpdate = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    console.log(req.body)

    try {
        await Project.findByIdAndUpdate(projectId, {
            $set: {
                'trainingDelivery': req.body
            }
        }, { new: true })

        res
            .status(200)
            .json({ message: "Checklist Updated." });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error updating checklist." });
    }

})

// Get Project By Id for a Trainer
const getProjectForTrainer = asyncHandler(async(req, res) => {
    const { trainerId } = req.params;
    const { projectId } = req.params;
    console.log(trainerId)
    try {

        // Fetch the projects where the trainer is in the trainers array.
        const trainer = await Trainer.findById(trainerId)
        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found" });
        }

        const projectExists = trainer
            .projects
            .includes(projectId)

        if (!projectExists) {
            return res
                .status(404)
                .json({ message: "Project not found for the trainer" });
        }

        const projects = await Project
            .findById(projectId)
            .select('projectName company.name trainers domain modeOfTraining trainingDates')
            .populate({ path: 'projectOwner', select: 'name email' })
            .lean();
        console.log(projects)
        projects.trainers = projects
            .trainers
            .filter(trainer => trainer.trainer.equals(trainerId));
        // console.log(object)
        res
            .status(200)
            .json({ project: projects })
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error getting projects." });
    }
})

// PO Upload to the File URL to the
const uploadPOUrl_Trainer = asyncHandler(async(req, res) => {
    const { trainerId } = req.params;
    const { projectId } = req.params;
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")

    console.log(req.body)

    try {
        const project = await Project.findById(projectId)
            // console.log(project)

        for (let i = 0; i < project.trainers.length; i++) {
            console.log(project.trainers[i])
            if (project.trainers[i].trainer.toString() === trainerId) {
                console.log("Trainer found", project.trainers[i].trainer)
                project.trainers[i].isClientCallDone = true
                project.trainers[i].purchaseOrder.url = req.body.url
                project.trainers[i].purchaseOrder.name = req.body.name
                project.trainers[i].purchaseOrder.time = new Date()
                project.trainers[i].purchaseOrder.details.description = req.body.description
                project.trainers[i].purchaseOrder.details.type = req.body.type
                project.trainers[i].purchaseOrder.details.terms = req.body.terms

                await project.save()

                break
            }
        }
        res.json({ message: " Done" });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading file URL." });
    }

})

// Invoice Upload to the
const upload_Invoice_Url_Trainer = asyncHandler(async(req, res) => {
    const { trainerId } = req.params;
    const { projectId } = req.params;
    console.log(trainerId)
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")

    console.log(req.body)

    try {
        const project = await Project.findById(projectId)
            // console.log(project)

        for (let i = 0; i < project.trainers.length; i++) {
            console.log(project.trainers[i])
            if (project.trainers[i].trainer.toString() === trainerId) {
                console.log("Trainer found", project.trainers[i].trainer)
                project.trainers[i].inVoice.isInvoice = true
                project.trainers[i].inVoice.InvoiceUrl = req.body.url
                    // project.trainers[i].inVoice.name = req.body.name
                project.trainers[i].inVoice.inVoiceDate = new Date()
                    // project.trainers[i].inVoice.details./

                await project.save()

                break
            }
        }
        res.json({ message: " Done", project: project });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading file URL." });
    }

})


// Invoice Upload to the
const upload_Invoice_Content_Trainer = asyncHandler(async(req, res) => {
    const { trainerId } = req.params;
    const { projectId } = req.params;
    console.log(trainerId)
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")

    console.log(req.body)

    try {
        const project = await Project.findById(projectId)
            // console.log(project)

        for (let i = 0; i < project.trainers.length; i++) {
            console.log(project.trainers[i])
            if (project.trainers[i].trainer.toString() === trainerId) {
                console.log("Trainer found", project.trainers[i].trainer)
                project.trainers[i].inVoice.isInvoice = true
                project.trainers[i].inVoice.inVoiceNumber = req.body.inVoiceNumber
                    // project.trainers[i].inVoice.name = req.body.name
                project.trainers[i].inVoice.inVoiceDate = new Date()
                    // project.trainers[i].inVoice.details./

                await project.save()

                break
            }
        }
        res.json({ message: " Done", project: project });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading file URL." });
    }

})

export {
    createProject,
    getProjectDetails,
    getProjectsByEmp,
    addTrainer,
    getProject,
    deleteTrainer,
    addResumeToProject,
    updateStage,
    addChatToProject,
    checkListUpdate,
    getAllNotes,
    getProjectForTrainer,
    isClientCallDone,
    uploadPOUrl_Trainer,
    upload_Invoice_Url_Trainer,
    upload_Invoice_Content_Trainer
}