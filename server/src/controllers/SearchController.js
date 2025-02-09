// import asyncHandler from "../utils/asyncHandler.js";
// import { Trainer } from "../models/TrainerModel.js";
// import Project from "../models/ProjectModel/ProjectModel.js";
// import moment from 'moment'
// // Build Filter Conditions for Training Domains
// const buildDomainConditions = (domain, minPrice, maxPrice, mode, type) => {
//     let conditions = [];
//     if (domain) {
//         conditions.push({
//             $regexMatch: {
//                 input: "$$td.domain",
//                 regex: new RegExp(domain, "i")
//             }
//         });
//     }
//     if (minPrice !== undefined) {
//         conditions.push({ $gte: ["$$td.price", minPrice] });
//     }
//     if (maxPrice !== undefined) {
//         conditions.push({ $lte: ["$$td.price", maxPrice] });
//     }
//     if (mode) {
//         conditions.push({ $eq: ["$$td.paymentSession", mode] });
//     }
//     if (type) {
//         conditions.push({ $eq: ["$$td.type", type] });
//     }
//     return conditions.length ? { $and: conditions } : {};
// };
// const convertTimeToMinutes = (time) => {
//     const [hours, minutes] = time.split(/[:\s]/);
//     const isPM = time.toLowerCase().includes("pm");
//     return parseInt(hours, 10) % 12 * 60 + parseInt(minutes, 10) + (isPM ? 720 : 0);
// }
// // Import necessary libraries

// // Search Trainers
// const searchTrainer = asyncHandler(async (req, res) => {
//     const { domain, price, mode, type, rating, startDate, endDate, startTime, endTime } = req.query;

//     // Normalize startTime and endTime to a consistent format
//     const normalizeTime = (time) => {
//         return time ? moment(time).utc().format('HH:mm:ss') : null;
//     };

//     const normalizedStartTime = normalizeTime(startTime);
//     const normalizedEndTime = normalizeTime(endTime);

//     try {
//         // Extract min and max price if available
//         let minPrice, maxPrice;
//         if (price) {
//             if (price.gte !== undefined) minPrice = Number(price.gte);
//             if (price.lte !== undefined) maxPrice = Number(price.lte);
//         }

//         // Build the pipeline for aggregation
//         const pipeline = [];

//         // Apply the rating filter globally
//         if (rating !== undefined) {
//             pipeline.push({
//                 $match: {
//                     "Rating.star": { $gte: Number(rating) },
//                 },
//             });
//         }

//         // Match trainers based on trainerType (internal or external)
//         pipeline.push(
//             { $match: { "trainingDetails.trainerType": { $exists: true } } },
//             {
//                 $facet: {
//                     internal: [
//                         { $match: { "trainingDetails.trainerType": "Internal" } },
//                         { $unwind: "$trainingDomain" },
//                         {
//                             $match: {
//                                 $and: [
//                                     domain ? { "trainingDomain.domain": { $regex: new RegExp(domain, "i") } } : {},
//                                     type ? { "trainingDomain.type": type } : {},
//                                 ],
//                             },
//                         },
//                         {
//                             $group: {
//                                 _id: "$_id",
//                                 generalDetails: { $first: "$generalDetails" },
//                                 trainerId: { $first: "$trainerId" },
//                                 Rating: { $first: "$Rating" },
//                                 trainingDomain: { $push: "$trainingDomain" },
//                                 workingDates: { $first: "$workingDates" },
//                             },
//                         },
//                     ],
//                     external: [
//                         { $match: { "trainingDetails.trainerType": { $ne: "Internal" } } },
//                         { $unwind: "$trainingDomain" },
//                         {
//                             $match: {
//                                 $and: [
//                                     domain ? { "trainingDomain.domain": { $regex: new RegExp(domain, "i") } } : {},
//                                     type ? { "trainingDomain.type": type } : {},
//                                     minPrice !== undefined ? { "trainingDomain.price": { $gte: minPrice } } : {},
//                                     maxPrice !== undefined ? { "trainingDomain.price": { $lte: maxPrice } } : {},
//                                     mode ? { "trainingDomain.paymentSession": mode } : {},
//                                 ],
//                             },
//                         },
//                         {
//                             $group: {
//                                 _id: "$_id",
//                                 generalDetails: { $first: "$generalDetails" },
//                                 trainerId: { $first: "$trainerId" },
//                                 Rating: { $first: "$Rating" },
//                                 trainingDomain: { $push: "$trainingDomain" },
//                                 workingDates: { $first: "$workingDates" },
//                             },
//                         },
//                     ],
//                 },
//             }
//         );

//         // Merge internal and external trainers, and sort them
//         pipeline.push({
//             $project: {
//                 trainers: {
//                     $concatArrays: ["$internal", "$external"],
//                 },
//             },
//         });

//         // Execute the aggregation pipeline
//         const result = await Trainer.aggregate(pipeline);

//         if (!result.length) {
//             return res.status(200).json({
//                 message: "No trainers found matching the criteria",
//                 result,
//             });
//         }

//         console.log(result[0]);

//         // Check availability within the specified dates and times
//         let availableTrainers = await Promise.all(
//             result[0].trainers.map(async (trainer) => {
//                 // Combine workingDates and project trainingDates for filtering
//                 const projectIds = trainer.projects || [];
//                 const projectDocs = await Project.find({ _id: { $in: projectIds } }, { trainingDates: 1 });

//                 const projectTrainingDates = projectDocs
//                     .map((project) => project.trainingDates)
//                     .flat(); // Flatten to get all training dates in one array

//                 const allOccupiedDates = [...trainer.workingDates, ...projectTrainingDates];

//                 // If no date range is provided, include the trainer
//                 if (!startDate || !endDate) {
//                     return trainer;
//                 }

//                 const inputStartDate = new Date(startDate);
//                 const inputEndDate = new Date(endDate);
//                 const inputStartTime = normalizedStartTime ? convertTimeToMinutes(normalizedStartTime) : null;
//                 const inputEndTime = normalizedEndTime ? convertTimeToMinutes(normalizedEndTime) : null;

//                 // Check availability for all occupied dates
//                 const isAvailable = allOccupiedDates.every((occupied) => {
//                     const occupiedStartDate = new Date(occupied.startDate);
//                     const occupiedEndDate = new Date(occupied.endDate);
//                     const occupiedStartTime = occupied.startTime ? convertTimeToMinutes(occupied.startTime) : null;
//                     const occupiedEndTime = occupied.endTime ? convertTimeToMinutes(occupied.endTime) : null;

//                     // Check date overlap
//                     const isDateOverlap = !(inputEndDate < occupiedStartDate || inputStartDate > occupiedEndDate);

//                     // Check time overlap only if both time inputs and occupied times exist
//                     let isTimeOverlap = false;
//                     if (inputStartTime !== null && inputEndTime !== null && occupiedStartTime !== null && occupiedEndTime !== null) {
//                         isTimeOverlap = !(inputEndTime <= occupiedStartTime || inputStartTime >= occupiedEndTime);
//                     }

//                     // Logic: If either time or date overlaps, exclude the trainer
//                     if (isDateOverlap && (isTimeOverlap || inputStartTime === null || inputEndTime === null)) {
//                         return false; // Trainer is unavailable
//                     }

//                     return true; // Trainer is available
//                 });

//                 return isAvailable ? trainer : null;
//             })
//         );

//         // Filter out null values from trainers who are unavailable
//         availableTrainers = availableTrainers.filter((trainer) => trainer !== null);

//         res.status(200).json(availableTrainers);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: "Trainer not available",
//             error: err,
//         });
//     }
// });



// export { searchTrainer };
import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";
import Project from "../models/ProjectModel/ProjectModel.js";
import moment from 'moment'
import Employee from "../models/EmployeeModel.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";

const searchTrainer = asyncHandler(async (req, res) => {
    const { domain, price, mode, type, rating, startDate, endDate, startTime, endTime } = req.query;

    // Get Emp Id
    // Check his role
    // If Role == KAM || ADMIN - Get all trainers   
    // If Trainer Sourcer - Only get his trainer
    const empId = req.params.empId;
    const employeeDetails = await Employee.findById(empId);
    if (!employeeDetails) {
        return res.status(404).json({
            message: "Employee not found",
        });
    }
    const pipeline = [];

    const role = employeeDetails.role;
    // check if the employee is a KAM || ADMIN
    let isTrainerSourcer = true;

    for(let i=0; i< role.length; i++){
        console.log(i, " ", role[i].name)
        if(role[i].name === "KeyAccounts" || role[i].name === "ADMIN"){
            isTrainerSourcer = false;
            break;
        }
    }
    let trainersId = []
    if(isTrainerSourcer){
        // Get only his trainers
        // console.log(employeeDetails.role)
        const trainerSourcerId = employeeDetails.role.filter((r) => r.name === "TrainerSourcer")[0].roleId;
        // console.log("dei" ,trainerSourcerId)
        const trainersByTrainerSourcer = await TrainerSourcer.findById(trainerSourcerId);
        if(!trainersByTrainerSourcer){
            return res.status(404).json({
                message: "Trainer Sourcer not found",
            });
        }
        trainersId = trainersByTrainerSourcer.registeredTrainers;

        pipeline.push({
            $match: {
                _id: { $in: trainersId }
            }
        })
    }
    try {
        // Extract min and max price if available
        let minPrice, maxPrice;
        if (price) {
            if (price.gte !== undefined) minPrice = Number(price.gte);
            if (price.lte !== undefined) maxPrice = Number(price.lte);
        }

        // Build the pipeline for aggregation
        // const pipeline = [];

        // Apply the rating filter globally
        if (rating !== undefined) {
            pipeline.push({
                $match: {
                    "Rating.star": { $gte: Number(rating) },
                },
            });
        }

        // Match trainers based on trainerType (internal or external)
        pipeline.push(
            { $match: { "trainingDetails.trainerType": { $exists: true } } },
            {
                $facet: {
                    internal: [
                        { $match: { "trainingDetails.trainerType": "Internal" } },
                        { $unwind: "$trainingDomain" },
                        {
                            $match: {
                                $and: [
                                    domain ? { "trainingDomain.domain": { $regex: new RegExp(domain, "i") } } : {},
                                    type ? { "trainingDomain.type": type } : {},
                                ],
                            },
                        },
                        {
                            $group: {
                                _id: "$_id",
                                generalDetails: { $first: "$generalDetails" },
                                trainerId: { $first: "$trainerId" },
                                Rating: { $first: "$Rating" },
                                trainingDomain: { $push: "$trainingDomain" },
                                workingDates: { $first: "$workingDates" },
                            },
                        },
                    ],
                    external: [
                        { $match: { "trainingDetails.trainerType": { $ne: "Internal" } } },
                        { $unwind: "$trainingDomain" },
                        {
                            $match: {
                                $and: [
                                    domain ? { "trainingDomain.domain": { $regex: new RegExp(domain, "i") } } : {},
                                    type ? { "trainingDomain.type": type } : {},
                                    minPrice !== undefined ? { "trainingDomain.price": { $gte: minPrice } } : {},
                                    maxPrice !== undefined ? { "trainingDomain.price": { $lte: maxPrice } } : {},
                                    mode ? { "trainingDomain.paymentSession": mode } : {},
                                ],
                            },
                        },
                        {
                            $group: {
                                _id: "$_id",
                                generalDetails: { $first: "$generalDetails" },
                                trainerId: { $first: "$trainerId" },
                                Rating: { $first: "$Rating" },
                                trainingDomain: { $push: "$trainingDomain" },
                                workingDates: { $first: "$workingDates" },
                            },
                        },
                    ],
                },
            }
        );
        console.log(1)

        // Merge internal and external trainers, and sort them
        pipeline.push({
            $project: {
                trainers: {
                    $concatArrays: ["$internal", "$external"],
                },
            },
        });

        // Execute the aggregation pipeline
        const result = await Trainer.aggregate(pipeline);

        if (!result.length) {
            return res.status(200).json({
                message: "No trainers found matching the criteria",
                result,
            });
        }
        console.log(2)

        // Check availability within the specicdfied dates
        let availableTrainers = await Promise.all(
            result[0].trainers.map(async (trainer) => {
                // Combine workingDates and project trainingDates for filtering
                const projectIds = trainer.projects || [];
                const projectDocs = await Project.find({ _id: { $in: projectIds } }, { trainingDates: 1 });

                const projectTrainingDates = projectDocs
                    .map((project) => project.trainingDates)
                    .flat(); // Flatten to get all training dates in one array

                const allOccupiedDates = [...trainer.workingDates, ...projectTrainingDates];

                // If no date range is provided, include the trainer
                if (!startDate || !endDate) {
                    return trainer;
                }

                const inputStartDate = new Date(startDate);
                const inputEndDate = new Date(endDate);
             const isAvailable = allOccupiedDates.every((occupied) => {
                    const occupiedStartDate = new Date(occupied.startDate);
                    const occupiedEndDate = new Date(occupied.endDate);

                    // Check date overlap
                    return inputEndDate < occupiedStartDate || inputStartDate > occupiedEndDate;
                });

                return isAvailable ? trainer : null;
            })
        );
        console.log(3)

        // Filter out null values from trainers who are unavailable
        availableTrainers = availableTrainers.filter((trainer) => trainer !== null);
        console.log(4)

        return res.status(200).json(availableTrainers);
        console.log(5)

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Trainer not available",
            error: err,
        });
    }
    
});

export { searchTrainer };
