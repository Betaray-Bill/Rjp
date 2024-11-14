import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";

// Build Search Project
const buildProjectStage = (domain, minPrice, maxPrice, mode, type) => {
    let conditions = [{
        $regexMatch: {
            input: "$$td.domain",
            regex: new RegExp(domain, "i")
        }
    }];

    if (minPrice !== undefined) {
        conditions.push({ $gte: ["$$td.price", minPrice] });
    }
    if (maxPrice !== undefined) {
        conditions.push({ $lte: ["$$td.price", maxPrice] });
    }
    if (mode) {
        conditions.push({ $eq: ["$$td.paymentSession", mode] });
    }

    if (mode) {
        conditions.push({ $eq: ["$$td.paymentSession", mode] });
    }

    if (type) {
        conditions.push({ $eq: ["$$td.type", type] });
    }

    return {
        $project: {
            trainingDomain: {
                $filter: {
                    input: "$trainingDomain",
                    as: "td",
                    cond: { $and: conditions },
                },
            },
            generalDetails: 1,
            trainerId: 1,
        },
    };
};


// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const { domain, price, mode, type } = req.query;
    console.log("QUERY ", req.query)
    try {
        let minPrice
        let maxPrice
        if (price) {
            if (price.gte !== undefined) {
                minPrice = price.gte ? Number(price.gte) : undefined;
            }
            if (price.lte !== undefined) {
                maxPrice = price.lte ? Number(price.lte) : undefined;
            }
        }
        console.log(minPrice, maxPrice)
        let pipeline = []
        if (domain) {
            pipeline.push({
                $match: {
                    "trainingDomain.domain": {
                        $regex: new RegExp(domain, "i"),
                    },
                },
            })
        }
        // Add $project stage based on filters
        pipeline.push(buildProjectStage(domain, minPrice, maxPrice, mode, type));

        // Filter out documents with empty trainingDomain array
        pipeline.push({
            $match: {
                trainingDomain: { $ne: [] },
            },
        });

        const result = await Trainer.aggregate(pipeline);

        if (!result.length) {
            return res.status(200).json({ message: 'No trainers found matching the criteria' });
        }

        res.status(200).json(result);
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({ message: 'Trainer not available', err });
    }

})

export { searchTrainer }