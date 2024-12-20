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
import { stages } from "../utils/constants.js";

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

    const stage = stages.TRAINING_ENQUIRY

    // Validate required fields
    if (!projectName || !domain || !company || !trainingDates || !modeOfTraining) {
        throw new Error('Required fields are missing.');
    }

    // Save the Project to the Company Check if company exists
    const companyExists = await Company.find({ companyName: company.name });
    console.log(companyExists)
    if (!companyExists) {
        throw new Error('Company not found.');
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
                email: contactDetails.contactEmail,
                contactNumber: contactDetails.contactPhoneNumber,
                department: contactDetails.department
            },
            domain,
            description,
            trainingDates: {
                startDate: trainingDates.startDate,
                endDate: trainingDates.endDate,
                startTime: trainingDates.startTime,
                endTime: trainingDates.endTime,
                specialTimings: trainingDates.specialTimings
            },
            modeOfTraining,
            stages: stage
                //
        });

        await newProject.save();
        console.log(newProject._id)
            // Save it in the Pipeline Add the Project to the Stage const pipeline = await
            // Pipeline.getSingletonPipeline(); console.log(pipeline)
        const updatedPipeline = await Pipeline.findOneAndUpdate({
            // _id: pipeline._id,
            "stages.name": stages.TRAINING_ENQUIRY
        }, {
            $push: {
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
            .json({ success: true, message: 'Project created.', project: newProject });

    } catch (err) {
        console.log(err)
        next(err);
        // return res     .status(500)     .json({ message: 'Error creating project.',
        // error: err.message });
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
                        select: 'projectName domain company.name  projectOwner  contactDetails.email trainingDate' +
                            's', // Only fetch the 'name' field from each employee
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
                            select: 'projectName domain company.name trainingDates contactDetails', // Select specific fields from 'Project'
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
    const { empId } = req.params;
    const { companyId, startDate, endDate } = req.query; // Extracting filters from query params
    let assignedProjects = [];

    try {
        // Fetch the employee and their roles
        const employee = await Employee.findById(empId).populate('role.roleId');
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Loop through roles to identify the employee's responsibilities
        for (let i = 0; i < employee.role.length; i++) {
            const role = employee.role[i];

            if (role.name === 'KeyAccounts') {
                // Extract projects assigned to Key Accounts
                assignedProjects = role.roleId.Projects.map((project) => project.toString());
                break;
            }

            if (role.name === 'ADMIN') {
                // Admin can access all projects in the pipeline
                const pipelines = await Pipeline.find().populate({
                    path: 'stages.projects',
                    select: 'projectName domain company trainingDates',
                    populate: {
                        path: 'projectOwner',
                        select: 'name email contactDetails.phone',
                    },
                });

                // Flatten all projects into a single array
                assignedProjects = pipelines.flatMap((pipeline) =>
                    pipeline.stages.flatMap((stage) => stage.projects.map((project) => project._id.toString()))
                );
                break;
            }

            if (role.name === 'Finance') {
                // Finance can access specific stages only
                const pipelines = await Pipeline.find({}, 'stages').populate({
                    path: 'stages.projects',
                    select: 'projectName domain company trainingDates',
                    populate: {
                        path: 'projectOwner',
                        select: 'name email contactDetails.phone',
                    },
                });

                assignedProjects = pipelines.flatMap((pipeline) =>
                    pipeline.stages
                    .filter((stage) => ["Payment", "PO received / Invoice Raised", "Invoice Sent"].includes(stage.name))
                    .flatMap((stage) => stage.projects.map((project) => project._id.toString()))
                );
                break;
            }
        }

        // Step 1: Filter by companyId (if provided)
        if (companyId) {
            const company = await Company.findById(companyId).populate('Projects');
            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }

            // Retain only projects belonging to the given company
            assignedProjects = assignedProjects.filter((projectId) =>
                company.Projects.some((companyProject) => companyProject._id.toString() === projectId)
            );
        }

        // Step 2: Filter by dates (if provided)
        if (startDate && endDate) {
            assignedProjects = await Project.find({
                _id: { $in: assignedProjects },
                $or: [{
                        'trainingDates.startDate': { $lte: endDate },
                        'trainingDates.endDate': { $gte: startDate },
                    },
                    {
                        'trainingDates.startDate': { $gte: startDate, $lte: endDate },
                    },
                    {
                        'trainingDates.endDate': { $gte: startDate, $lte: endDate },
                    },
                ],
            }).populate('projectOwner', 'name email contactDetails.phone');
        } else {
            // If no date filters are provided, fetch projects directly
            assignedProjects = await Project.find({ _id: { $in: assignedProjects } }).populate(
                'projectOwner',
                'name email contactDetails.phone'
            );
        }

        // Step 3: Group projects by pipeline stages
        const pipelines = await Pipeline.find().populate({
            path: 'stages.projects',
            match: { _id: { $in: assignedProjects.map((p) => p._id) } },
        });

        const result = pipelines.flatMap((pipeline) =>
            pipeline.stages.map((stage) => ({
                name: stage.name,
                projects: stage.projects,
            }))
        );

        res.json({ projects: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});


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

// Update Training
const updateTraining = asyncHandler(async(req, res) => {
    const { projectId, trainerId } = req.params;
    // const { trainerType, resumeVersion } = req.body;
    console.log(req.body)
    const project = await Project.findByIdAndUpdate(projectId, {
        $set: {
            ...req.body
        },
        arrayFilters: [{
            "_id": trainerId
        }]
    }, { new: true });

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
    const projects = await Project.findById(projectId)
    console.log(projects)
    const session = await Project.startSession(); // Use a session for transaction
    session.startTransaction();
    console.log(1)

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
            // for (let i = 0; i < trainersList.length; i++) {     console.log("1",
            // trainersList[i])     await Trainer.findByIdAndUpdate( trainersList[i], {
            //   $addToSet: {                 projects: project._id, workingDates: {
            //             startDate: project.trainingDates.startDate,
            // endDate: project.trainingDates.endDate,                     startTime:
            // project.trainingDates.startTime,                     endTime:
            // project.trainingDates.endTime,                     specialTimings:
            // project.trainingDates.specialTimings,                     name:
            // project.projectName,                     id: project._id,                 },
            //          },         }, { new: true }     );     // console.log("Trainer
            // updated", trainer) }

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

        // Check if the Trainer can view the PO yet

        const projects = await Project
            .findById(projectId)
            .select('projectName company.name trainers domain modeOfTraining trainingDates')
            .populate({ path: 'projectOwner', select: 'name email' })
            .lean();
        // console.log(projects) projects.trainers

        projects.trainers = projects
            .trainers
            .filter(trainer => trainer.trainer.equals(trainerId)) // Match trainer ID
            .map(trainer => {
                // Filter purchaseOrder where canSend is true
                trainer.purchaseOrder = trainer
                    .purchaseOrder
                    .filter(po => po.canSend === true);
                return trainer;
            });

        // if(a.length > 0) {     if(a[0].purchaseOrder.canSend === true){         let
        // details = [...]     } } console.log(object)
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
            // console.log(project) Find the trainer
        const trainer = project
            .trainers
            .find((t) => t.trainer.toString() === trainerId);

        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found in the project" });
        }

        // Check if the purchaseOrder index exists if
        // (!trainer.purchaseOrder[req.body.poNumber]) {     return res .status(404)
        // .json({ message: `Purchase Order with index ${ req.body.poNumber} not found`
        // }); } Check if purchaseOrder exists, if not initialize it
        if (!trainer.purchaseOrder) {
            trainer.purchaseOrder = [];
        }

        // Update the specific purchase order
        if (!trainer.purchaseOrder[req.body.poNumber]) {
            // Add a new entry if the index doesn't exist
            trainer.purchaseOrder[req.body.poNumber] = {
                poNumber: req.body.poNumber,
                isReIssue: trainer.purchaseOrder[req.body.poNumber].isDeclined ?
                    true : false,
                isDeclined: false,
                isAccepted: false,
                // isReIssue: false,
                name: req.body.name,
                time: new Date(),
                details: {
                    description: req.body.details.description,
                    type: req.body.details.type,
                    terms: req.body.details.terms
                }
            };
        } else {
            const purchaseOrder = trainer.purchaseOrder[req.body.poNumber];
            purchaseOrder.canSend = true;
            purchaseOrder.isReIssue = trainer.purchaseOrder[req.body.poNumber].isDeclined ?
                true :
                false;
            purchaseOrder.isDeclined = false;
            // purchaseOrder.isReIssue = trainer.purchaseOrder[req.body.poNumber].isDeclined
            // ? true : false;
            purchaseOrder.isAccepted = false;
            purchaseOrder.poNumber = req.body.poNumber;
            purchaseOrder.name = req.body.name;
            purchaseOrder.time = new Date();
            purchaseOrder.details = {
                description: req.body.details.description,
                type: req.body.details.type,
                terms: req.body.details.terms
            };
        }
        // console.log(purchaseOrder) Save the updated project
        await project.save();
        res.json({ message: " Done" });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading file URL." });
    }

})

// Save PO in the DB, doesn't send the PO
const savePurchaseOrder = asyncHandler(async(req, res) => {
    const { trainerId } = req.params;
    const { projectId } = req.params;
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")
    console.log("-----------------------------------")

    console.log(req.body)

    try {
        const project = await Project.findById(projectId)
            // console.log(project) Find the trainer
        const trainer = project
            .trainers
            .find((t) => t.trainer.toString() === trainerId);

        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found in the project" });
        }

        // Check if the purchaseOrder index exists if
        // (!trainer.purchaseOrder[req.body.poNumber]) {     return res .status(404)
        // .json({ message: `Purchase Order with index ${ req.body.poNumber} not found`
        // }); } Check if purchaseOrder exists, if not initialize it
        if (!trainer.purchaseOrder) {
            trainer.purchaseOrder = [];
        }

        // Update the specific purchase order
        if (!trainer.purchaseOrder[req.body.poNumber]) {
            // Add a new entry if the index doesn't exist
            trainer.purchaseOrder[req.body.poNumber] = {
                poNumber: req.body.poNumber,
                name: req.body.name,
                time: new Date(),
                isDeclined: false,
                isAccepted: false,
                details: {
                    description: req.body.details.description,
                    type: req.body.details.type,
                    terms: req.body.details.terms
                }
            };
        } else {
            const purchaseOrder = trainer.purchaseOrder[req.body.poNumber];
            purchaseOrder.canSend = false;
            purchaseOrder.isDeclined = false;
            purchaseOrder.isAccepted = false;
            purchaseOrder.poNumber = req.body.poNumber;
            purchaseOrder.name = req.body.name;
            purchaseOrder.time = new Date();
            purchaseOrder.details = {
                description: req.body.details.description,
                type: req.body.details.type,
                terms: req.body.details.terms
            };
        }
        // console.log(purchaseOrder) Save the updated project
        await project.save();

        res.json({ message: " Done" });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading PO" });
    }

})

// Accept or Decline the INvoice
const acceptOrDecline = asyncHandler(async(req, res) => {
    const { trainerId } = req.params;
    const { projectId } = req.params;
    console.log("-----------------------------------")
    try {
        const project = await Project.findById(projectId)
            // console.log(project) Find the trainer
        const trainer = project
            .trainers
            .find((t) => t.trainer.toString() === trainerId);
        console.log(req.body)
        console.log(1)
        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found in the project" });
        }

        if (!trainer.purchaseOrder) {
            trainer.purchaseOrder = [];
        }

        // Update the specific purchase order
        if (req.body.isAccepted) {
            if (!trainer.purchaseOrder[req.body.poNumber]) {
                // Add a new entry if the index doesn't exist
                trainer.purchaseOrder[req.body.poNumber] = {
                    isAccepted: req.body.isAccepted,
                    isDeclined: false
                };
            } else {
                let purchaseOrder = trainer.purchaseOrder[req.body.poNumber];
                purchaseOrder.isAccepted = req.body.isAccepted
                purchaseOrder.isDeclined = false
            }
        } else {
            console.log("DEclined Section")
            if (!trainer.purchaseOrder[req.body.poNumber]) {
                // Add a new entry if the index doesn't exist
                trainer.purchaseOrder[req.body.poNumber] = {
                    isAccepted: false,
                    canSend: false,
                    isDeclined: true
                };
            } else {
                let purchaseOrder = trainer.purchaseOrder[req.body.poNumber];
                purchaseOrder.isAccepted = false
                purchaseOrder.isDeclined = true
                purchaseOrder.canSend = false
                    // isDeclined:true
            }
            // console.log(purchaseOrder)
        }

        // console.log(purchaseOrder) Save the updated project
        await project.save();
        res.json({ message: " Done" });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading PO" });
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
            // console.log(project) Find the trainer
        const trainer = project
            .trainers
            .find((t) => t.trainer.toString() === trainerId);

        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found in the project" });
        }

        if (!trainer.inVoice) {
            trainer.inVoice = [];
        }

        // Update the specific purchase order
        if (!trainer.inVoice[req.body.index]) {
            // Add a new entry if the index doesn't exist
            trainer.inVoice[req.body.index] = {
                InvoiceUrl: req.body.url
            };
        } else {
            const inVoice = trainer.inVoice[req.body.index];
            inVoice.InvoiceUrl = req.body.url
        };
        // }

        await project.save();

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

// // Invoice Upload to the
const updateInvoice_by_paid = asyncHandler(async(req, res) => {
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
            // console.log(project) Find the trainer
        const trainer = project
            .trainers
            .find((t) => t.trainer.toString() === trainerId);

        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found in the project" });
        }

        // Update the specific purchase order
        if (!trainer.inVoice[req.body.index]) {
            // Add a new entry if the index doesn't exist
            trainer.inVoice[req.body.index] = {
                isPaid: req.body.isPaid,
                description: req.body.description,
                // isPaid: req.body.isPaid,
            };
        } else {
            const inVoice = trainer.inVoice[req.body.index];
            inVoice.isPaid = req.body.isPaid
            inVoice.description = req.body.description
        };
        // }

        await project.save();

        res.json({ message: " Done", project: project });

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading file URL." });
    }

})

// Remainders ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const addRemainders = asyncHandler(async(req, res) => {
    const { projectId, date, stages, description, isCompleted } = req.body;
    console.log(req.body)
        // Validate input
    if (!projectId || !date || !stages || !description) {
        return res
            .status(400)
            .json({ message: 'All fields are required.' });
    }
    // console.log(project.remainders) Find the project by ID
    const project = await Project.findById(projectId);
    console.log(project.remainders)

    if (!project) {
        return res
            .status(404)
            .json({ message: 'Project not found.' });
    }

    // Check if the project has remainders
    if (project.remainders && project.remainders.length > 0) {
        // console.log("1") Check if the current project stage already has a remainder
        const existingRemainder = project
            .remainders
            .find((rem) => rem.stages === stages);

        if (existingRemainder) {
            console.log("2")
                // Update the existing remainder
            existingRemainder.date = date;
            existingRemainder.description = description;
            existingRemainder.isCompleted = isCompleted;
        } else {
            // console.log("3") Add a new remainder object to the array
            project
                .remainders
                .push({ date, stages, description, isCompleted, projectId });
        }
    } else {
        // console.log("4", project.remainders.remainders.length) No remainders exist,
        // create a new one
        project.remainders = {
            date,
            stages,
            description,
            isCompleted,
            projectId
        }
    }

    // Save the updated project
    const updatedProject = await project.save();

    res
        .status(200)
        .json({
            message: 'Remainder added/updated successfully.',
            // data: updatedProject,
        });
});

// Expenses
const addExpenses = asyncHandler(async(req, res) => {
    const { date, stages, description, isCompleted } = req.body;
    const projectId = req.params
    console.log(req.body)
        // Validate input if (!projectId || !date || !stages || !description) { return
        // res         .status(400)         .json({ message: 'All fields are required.'
        // }); } console.log(project.remainders) Find the project by ID
    const project = await Project.findById(projectId.projectId);
    // console.log(project.expenses)

    if (!project) {
        return res
            .status(404)
            .json({ message: 'Project not found.' });
    }

    try {
        //
        project.expenses = {
            ...req.body
        };
        // Save the updated project
        const updatedProject = await project.save();

        res
            .status(200)
            .json({
                message: 'Remainder added/updated successfully.',
                // data: updatedProject,
            });
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error uploading file URL." });
    }
});

// GET Remainder

const getRemainders = asyncHandler(async(req, res) => {
    try {
        console.log(req.query)
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        console.log(1)
        let projects = []

        if (startDate && endDate) {
            projects = await Project.aggregate([{
                $match: {
                    "remainders": {
                        $elemMatch: {
                            date: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            },
                            isCompleted: false
                        }
                    }
                }
            }, {
                $project: {
                    _id: 1, // Include project name if needed
                    stages: 1,
                    projectName: 1,
                    remainders: {
                        $filter: {
                            input: "$remainders",
                            as: "remainder",
                            cond: {
                                $and: [{
                                    $gte: ["$$remainder.date", new Date(startDate)]
                                }, {
                                    $lte: ["$$remainder.date", new Date(endDate)]
                                }, {
                                    $eq: ["$$remainder.isCompleted", false]
                                }]
                            }
                        }
                    }
                }
            }]);

        } else if (startDate) {
            console.log(startDate)
            projects = await Project.aggregate([{
                    $match: {
                        "remainders": {
                            $elemMatch: {
                                date: {
                                    $eq: new Date(startDate),
                                },
                                isCompleted: false
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1, // Include project name if needed
                        stages: 1,
                        projectName: 1,
                        remainders: {
                            $filter: {
                                input: "$remainders",
                                as: "remainder",
                                cond: {
                                    $and: [{
                                        $eq: ["$$remainder.date", new Date(startDate)]
                                    }, {
                                        $eq: ["$$remainder.isCompleted", false]
                                    }]
                                }
                            }
                        }
                    }
                },
                {
                    $sort: {
                        "remainders.date": -1
                    }
                }
            ]);
        }
        res.json(projects);

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .json({ message: "Error getting remainders." });
    }
});


// Client INvoice Sent 
const client_invoice_sent = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    console.log(req.body)

    try {
        await Project.findByIdAndUpdate(projectId, {
            invoiceSentClient: true
        }, { new: true })

        res.json({ message: "Client Invoice Sent" });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error updating client invoice sent status." });
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
    updateTraining,
    isClientCallDone,
    uploadPOUrl_Trainer,
    upload_Invoice_Url_Trainer,
    savePurchaseOrder,
    upload_Invoice_Content_Trainer,
    acceptOrDecline,
    updateInvoice_by_paid,
    addExpenses,
    addRemainders,
    getRemainders,
    client_invoice_sent
}