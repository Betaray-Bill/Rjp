import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";

// Build Filter Conditions for Training Domains
const buildDomainConditions = (domain, minPrice, maxPrice, mode, type) => {
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
    return conditions.length ? { $and: conditions } : {};
};

// Search Trainers
const searchTrainer = asyncHandler(async(req, res) => {
    const { domain, price, mode, type, startDate, endDate, rating } = req.query;

    try {
        let minPrice, maxPrice;
        if (price) {
            if (price.gte !== undefined) minPrice = Number(price.gte);
            if (price.lte !== undefined) maxPrice = Number(price.lte);
        }

        const conditions = [];
        if (domain) {
            conditions.push({ $regexMatch: { input: "$$td.domain", regex: new RegExp(domain, "i") } });
        }
        if (minPrice !== undefined) conditions.push({ $gte: ["$$td.price", minPrice] });
        if (maxPrice !== undefined) conditions.push({ $lte: ["$$td.price", maxPrice] });
        if (mode) conditions.push({ $eq: ["$$td.paymentSession", mode] });
        if (type) conditions.push({ $eq: ["$$td.type", type] });

        const pipeline = [];

        // Separate internal trainers
        pipeline.push({ $match: { "trainingDetails.trainerType": { $exists: true } } }, {
            $facet: {
                internal: [
                    { $match: { "trainingDetails.trainerType": "Internal" } },
                    { $unwind: "$trainingDomain" },
                    {
                        $match: {
                            $and: [
                                domain ? { "trainingDomain.domain": { $regex: new RegExp(domain, "i") } } : {},
                                type ? { "trainingDomain.type": type } : {},
                                startDate && endDate ? {
                                    $and: [
                                        { "trainingDomain.trainingDates.startDate": { $lte: new Date(endDate) } },
                                        { "trainingDomain.trainingDates.endDate": { $gte: new Date(startDate) } },
                                    ],
                                } : {},
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
                                startDate && endDate ? {
                                    $and: [
                                        { "trainingDomain.trainingDates.startDate": { $lte: new Date(endDate) } },
                                        { "trainingDomain.trainingDates.endDate": { $gte: new Date(startDate) } },
                                    ],
                                } : {},
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
                        },
                    },
                ],
            },
        });

        // Merge internal and external trainers, and sort them
        pipeline.push({
            $project: {
                trainers: {
                    $concatArrays: ["$internal", "$external"],
                },
                // 'generalDetails.name': 1
            },
        });

        const result = await Trainer.aggregate(pipeline);

        if (!result.length) {
            return res.status(200).json({ message: "No trainers found matching the criteria", result });
        }

        res.status(200).json(result[0].trainers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Trainer not available", error: err });
    }
});


export { searchTrainer };