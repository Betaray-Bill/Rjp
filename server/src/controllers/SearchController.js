import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";

// Build Search Project
const buildProjectStage = (domain, minPrice, maxPrice, mode, type, startDate, endDate, rating) => {
    let conditions = [];

    if (domain) {
        conditions.push({
            $regexMatch: {
                input: "$$td.domain",
                regex: new RegExp(domain, "i")
            }
        });
    }

    if (minPrice !== undefined) {
        conditions.push({
            $gte: ["$$td.price", minPrice]
        });
    }
    if (maxPrice !== undefined) {
        conditions.push({
            $lte: ["$$td.price", maxPrice]
        });
    }
    if (mode) {
        conditions.push({
            $eq: ["$$td.paymentSession", mode]
        });
    }
    if (type) {
        conditions.push({
            $eq: ["$$td.type", type]
        });
    }

    const projectStages = [];

    if (startDate && endDate) {
        // const startDate = new Date(startDate) const endDate = new Date(endDate)

        projectStages.push({
            $lookup: {
                from: "Project", // Assuming the projects collection is named 'projects'
                localField: "projects",
                foreignField: "_id",
                as: "projects"
            }
        }, {
            $addFields: {
                hasConflict: {
                    $anyElementTrue: {
                        $map: {
                            input: "$projects",
                            as: "project",
                            in: {
                                // $or: [{ Check for overlap in trainingDates
                                $and: [{
                                    $lte: ["$$project.trainingDates.startDate", new Date(endDate)]
                                }, {
                                    $gte: ["$$project.trainingDates.endDate", new Date(startDate)]
                                }],
                                // }, {     // Check for overlap in specialTimings (with $ifNull to handle null
                                // cases)     $anyElementTrue: {         $map: {             input: { $ifNull:
                                // ["$$project.trainingDates.specialTimings", []] },             as: "special",
                                //           in: {                 $and: [                     { $lte:
                                // ["$$special.date", new Date(endDate)] },                     { $gte:
                                // ["$$special.date", new Date(startDate)] },                 ],             },
                                //       },     }, }, ],
                            }
                        }
                    }
                }
            }
        }, {
            $match: {
                hasConflict: {
                    $ne: true
                }, // Only include trainers without conflicts
            }
        });
    }

    console.log(projectStages)

    return {

        $project: {
            trainingDomain: {
                $filter: {
                    input: "$trainingDomain",
                    as: "td",
                    cond: {
                        $and: conditions
                    }
                }
            },
            Rating: 1,
            generalDetails: 1,
            trainerId: 1,
            projects: 1,
            filteredProjects: "$projects"
        }
    }
};

// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const {
        domain,
        price,
        mode,
        type,
        startDate,
        endDate,
        rating
    } = req.query;

    try {
        let minPrice,
            maxPrice;
        if (price) {
            if (price.gte !== undefined) {
                minPrice = Number(price.gte);
            }
            if (price.lte !== undefined) {
                maxPrice = Number(price.lte);
            }
        }

        let pipeline = [];

        // Add domain filter if applicable
        if (domain) {
            pipeline.push({
                $match: {
                    "trainingDomain.domain": {
                        $regex: new RegExp(domain, "i")
                    }
                }
            });
        }

        // Add the project filtering stages to the pipeline
        pipeline.push(buildProjectStage(domain, minPrice, maxPrice, mode, type, startDate, endDate, rating));

        // Start date and end date Add a match stage for Rating if provided
        if (rating !== undefined) {
            pipeline.push({
                $match: {
                    "Rating.star": {
                        $gte: Number(rating)
                    }
                }
            });
        }

        // Filter out trainers with no training domains
        pipeline.push({
            $match: {
                trainingDomain: {
                    $ne: []
                }
            }
        });

        // Sort by Rating
        pipeline.push({
            $sort: {
                "Rating.star": -1
            }
        });

        // Add $lookup to populate the `projects` field
        pipeline.push({
            $lookup: {
                from: "projects", // Replace "projects" with the actual name of your projects collection
                localField: "projects", // Field in the Trainer collection containing project IDs
                foreignField: "_id", // Field in the Projects collection matching the IDs
                as: "projects", // The populated field
            }
        });

        // Project specific fields in the populated projects
        pipeline.push({
            $project: {
                trainingDomain: 1,
                Rating: 1,
                generalDetails: 1,
                trainerId: 1,
                filteredProjects: "$projects",
                projects: {
                    $map: {
                        input: "$projects",
                        as: "project",
                        in: {
                            _id: "$$project._id",
                            projectName: "$$project.projectName",
                            trainingDates: "$$project.trainingDates"
                        }
                    }
                }
            }
        });

        // Execute the pipeline
        let result = await Trainer.aggregate(pipeline)

        if (startDate && endDate) {

            result = await result.filter((trainer) => {
                // Check if the trainer is in the given domain Check if the trainer has any
                // projects with conflicting training dates
                const hasConflictingDates = trainer
                    .projects
                    .some((project) => {
                        const trainingDates = project.trainingDates;

                        if (!trainingDates || !trainingDates.startDate || !trainingDates.endDate) {
                            return false;
                        }

                        const projectStartDate = new Date(trainingDates.startDate);
                        const projectEndDate = new Date(trainingDates.endDate);

                        let start_Date = new Date(startDate)
                        let end_Date = new Date(endDate)

                        // Check if the input date range overlaps with the project's training dates
                        return ((start_Date > projectStartDate && start_Date < projectEndDate) || // Input start date overlaps
                            (end_Date > projectStartDate && end_Date < projectEndDate) || // Input end date overlaps
                            (projectStartDate > start_Date && projectStartDate < end_Date) || // Project start date overlaps
                            (projectEndDate > start_Date && projectEndDate < end_Date) || // Project end date overlaps
                            (projectStartDate > start_Date && projectStartDate < end_Date) || // Project start date overlaps
                            (projectEndDate > start_Date && projectEndDate < end_Date));
                    });

                // working Dates
                let hasWorkingDates
                if (Array.isArray(trainer.workingDates)) {
                    hasWorkingDates = trainer
                        .workingDates
                        .some((dates) => {
                            // const trainingDates = project.trainingDates;

                            if (!dates || !dates.startDate || !dates.endDate) {
                                return false;
                            }

                            const projectStartDate = new Date(dates.startDate);
                            const projectEndDate = new Date(dates.endDate);

                            let start_Date = new Date(startDate)
                            let end_Date = new Date(endDate)

                            return ((start_Date > projectStartDate && start_Date < projectEndDate) || // Input start date overlaps
                                (end_Date > projectStartDate && end_Date < projectEndDate) || // Input end date overlaps
                                (projectStartDate > start_Date && projectStartDate < end_Date) || // Project start date overlaps
                                (projectEndDate > start_Date && projectEndDate < end_Date))

                        })
                }

                return !hasConflictingDates && !hasWorkingDates;
            });
        }

        if (!result.length) {
            return res
                .status(200)
                .json({ message: "No trainers found matching the criteria", result });
        }

        res
            .status(200)
            .json(result);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Trainer not available", error: err });
    }
});

export { searchTrainer };