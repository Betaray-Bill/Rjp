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
    // if (rating !== undefined) {
    //     let star = Number(rating);
    //     conditions.push({ $gte: ["$$td.Rating.star", star] });
    // }
    const projectStages = [];
    if (startDate && endDate) {
        projectStages.push({
            $lookup: {
                from: "projects", // Assuming the projects collection is named 'projects'
                localField: "projects",
                foreignField: "_id",
                as: "projects",
            },
        }, {
            $addFields: {
                filteredProjects: {
                    $filter: {
                        input: "$projects",
                        as: "project",
                        cond: {
                            $or: [
                                { $lt: ["$$project.trainingDates.endDate", new Date(startDate)] }, // Ends before the range
                                { $gt: ["$$project.trainingDates.startDate", new Date(endDate)] }, // Starts after the range
                            ],
                        },
                    },
                },
            },
        }, {
            $match: {
                filteredProjects: { $ne: [] }, // Ensure there are projects that satisfy the condition
            },
        });
    }
    console.log(conditions)
        // return [
        //     // ...projectStages,
        //     {
        //         $project: {
        //             trainingDomain: {
        //                 $filter: {
        //                     input: "$trainingDomain",
        //                     as: "td",
        //                     cond: { $and: conditions },
        //                 },
        //             },
        //             generalDetails: 1,
        //             trainerId: 1,
        //             // trainingDomain: 1,
        //             filteredProjects: 1,
        //         },
        //     },
        // ];


    return {
        // ...projectStages,
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
        },
    };
};

// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const { domain, price, mode, type, startDate, endDate, rating } = req.query;
    console.log(req.query)
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
        if (domain) {
            pipeline.push({
                $match: {
                    "trainingDomain.domain": {
                        $regex: new RegExp(domain, "i"),
                    },
                },
            });
        }

        // Add the project stages to the pipeline
        let a = buildProjectStage(domain, minPrice, maxPrice, mode, type, startDate, endDate, rating)
            // console.log("PIpeline", a)
        pipeline.push(a);

        if (rating !== undefined) {
            pipeline.push({
                $match: {
                    "Rating.star": { $gte: Number(rating) }
                },

            })
        }

        console.log(pipeline)

        pipeline.push({
            $match: {
                trainingDomain: { $ne: [] }
            },

        })

        pipeline.push({
            $sort: {
                "Rating.star": -1
            },

        })

        // Execute the pipeline
        const result = await Trainer.aggregate(pipeline);
        // console.log(result)

        if (!result.length) {
            return res.status(200).json({ message: "No trainers found matching the criteria" });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Trainer not available", error: err });
    }
});

export { searchTrainer };