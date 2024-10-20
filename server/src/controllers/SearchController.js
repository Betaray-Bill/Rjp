import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";

// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const { domain, price } = req.query;
    try {

        const minPrice = price.gte ? parseFloat(price.gte) : undefined;
        const maxPrice = price.lte ? parseFloat(price.lte) : undefined;

        // Define the aggregation pipeline
        const pipeline = [
            // Match documents where trainingDomain contains the specified domain
            {
                $match: {
                    'trainingDomain.domain': domain
                }
            },
            // Project to filter the trainingDomain array based on domain and price range
            {
                $project: {
                    name: 1, // Include any other fields you need
                    trainingDomain: {
                        $filter: {
                            input: '$trainingDomain',
                            as: 'td',
                            cond: {
                                $and: [
                                    { $eq: ['$$td.domain', domain] },
                                    minPrice !== undefined ? { $gte: [{ $toDouble: '$$td.price' }, minPrice] } : {},
                                    maxPrice !== undefined ? { $lte: [{ $toDouble: '$$td.price' }, maxPrice] } : {}
                                ]
                            }
                        }
                    },
                    generalDetails: 1,
                    bankDetails: 1
                }
            },
            // Ensure only documents with a non-empty trainingDomain array are returned
            {
                $match: {
                    trainingDomain: { $ne: [] }
                }
            }
        ];

        // Execute the aggregation
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