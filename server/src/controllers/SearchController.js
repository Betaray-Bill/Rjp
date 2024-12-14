import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";

// Build Search Project
const buildProjectStage = (domain, minPrice, maxPrice, mode, type, startDate, endDate, rating) => {
    let conditions = [];

    if (domain) {
        conditions.push({
            $regexMatch: {
                input: "$$td.domain",
                regex: new RegExp(domain, "i"),
            },
        });
    }

    if (minPrice !== undefined) {
        conditions.push({ $gte: ["$$td.price", minPrice] });
    }
    if (maxPrice !== undefined) {
        conditions.push({ $lte: ["$$td.price", maxPrice] });
    }
    if (mode) {
        conditions.push({ $eq: ["$$td.paymentSession", mode] });
    }
    if (type) {
        conditions.push({ $eq: ["$$td.type", type] });
    }

    const projectStages = [];

    if (startDate && endDate) {
        // const startDate = new Date(startDate)
        // const endDate = new Date(endDate)

        projectStages.push({
            $lookup: {
                from: "Project", // Assuming the projects collection is named 'projects'
                localField: "projects",
                foreignField: "_id",
                as: "projects",
            },
        }, {
            $addFields: {
                hasConflict: {
                    $anyElementTrue: {
                        $map: {
                            input: "$projects",
                            as: "project",
                            in: {
                                $or: [{
                                        // Check for overlap in trainingDates
                                        $and: [
                                            { $lte: ["$$project.trainingDates.startDate", new Date(endDate)] },
                                            { $gte: ["$$project.trainingDates.endDate", new Date(startDate)] },
                                        ],
                                    },
                                    {
                                        // Check for overlap in specialTimings (with $ifNull to handle null cases)
                                        $anyElementTrue: {
                                            $map: {
                                                input: { $ifNull: ["$$project.trainingDates.specialTimings", []] },
                                                as: "special",
                                                in: {
                                                    $and: [
                                                        { $lte: ["$$special.date", new Date(endDate)] },
                                                        { $gte: ["$$special.date", new Date(startDate)] },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        }, {
            $match: {
                hasConflict: { $ne: true }, // Only include trainers without conflicts
            },
        });
    }

    console.log(projectStages)

    return [
        ...projectStages,
        {
            $project: {
                trainingDomain: {
                    $filter: {
                        input: "$trainingDomain",
                        as: "td",
                        cond: { $and: conditions },
                    },
                },
                Rating: 1,
                generalDetails: 1,
                trainerId: 1,
                filteredProjects: "$projects",
            },
        },
    ];
};


// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const { domain, price, mode, type, startDate, endDate, rating } = req.query;

    try {
        let minPrice, maxPrice;
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
                        $regex: new RegExp(domain, "i"),
                    },
                },
            });
        }

        if (startDate && endDate) {
            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);

            // Check if dates are valid
            if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
                return res.status(400).json({ message: "Invalid date format" });
            }
        }

        // Add the project filtering stages to the pipeline
        pipeline.push(...buildProjectStage(domain, minPrice, maxPrice, mode, type, startDate, endDate, rating));

        // Add a match stage for Rating if provided
        if (rating !== undefined) {
            pipeline.push({
                $match: {
                    "Rating.star": { $gte: Number(rating) },
                },
            });
        }

        // Filter out trainers with no training domains
        pipeline.push({
            $match: {
                trainingDomain: { $ne: [] },
            },
        });

        // Sort by Rating
        pipeline.push({
            $sort: {
                "Rating.star": -1,
            },
        });

        // Execute the pipeline
        const result = await Trainer.aggregate(pipeline);

        if (!result.length) {
            return res.status(200).json({ message: "No trainers found matching the criteria", result });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Trainer not available", error: err });
    }
});


export { searchTrainer };