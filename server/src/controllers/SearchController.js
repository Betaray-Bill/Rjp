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
const searchTrainer = asyncHandler(async (req, res) => {
    const { domain, price, mode, type, rating, startDate, endDate, startTime, endTime } = req.query;

    try {
        // Extract min and max price if available
        let minPrice, maxPrice;
        if (price) {
            if (price.gte !== undefined) minPrice = Number(price.gte);
            if (price.lte !== undefined) maxPrice = Number(price.lte);
        }

        // Build the pipeline for aggregation
        const pipeline = [];

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

        // Check availability within the specified dates and times
        let availableTrainers = result[0].trainers.filter((trainer) => {
            if (!startDate || !endDate) return true; // Skip date filtering if no date range provided

            const start = new Date(startDate);
            const end = new Date(endDate);

            return trainer.workingDates.every((work) => {
                const workStart = new Date(work.startDate);
                const workEnd = new Date(work.endDate);

                // Check if the training dates overlap
                const dateOverlap = end < workStart || start > workEnd;

                if (!dateOverlap) {
                    // If there is a date overlap, check timing if provided
                    if (startTime && endTime) {
                        const [startHours, startMinutes] = startTime.split(/[:\s]/);
                        const [endHours, endMinutes] = endTime.split(/[:\s]/);
                        const [workStartHours, workStartMinutes] = work.startTime.split(/[:\s]/);
                        const [workEndHours, workEndMinutes] = work.endTime.split(/[:\s]/);

                        const trainingStartTime = parseInt(startHours, 10) * 60 + parseInt(startMinutes, 10);
                        const trainingEndTime = parseInt(endHours, 10) * 60 + parseInt(endMinutes, 10);
                        const workStartTime = parseInt(workStartHours, 10) * 60 + parseInt(workStartMinutes, 10);
                        const workEndTime = parseInt(workEndHours, 10) * 60 + parseInt(workEndMinutes, 10);

                        // Timing overlap condition
                        return (
                            trainingEndTime <= workStartTime || trainingStartTime >= workEndTime
                        );
                    }
                    return false;
                }
                return true;
            });
        });

        res.status(200).json(availableTrainers);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Trainer not available",
            error: err,
        });
    }
});



export { searchTrainer };