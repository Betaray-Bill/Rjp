import asyncHandler from "../utils/asyncHandler.js";
import Trainer from "../models/TrainerModel.js";

// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const query = req.query.search
    console.log(query)
    let pipeline = [];

    const { startPrice, endPrice, startDate, endDate, rating } = req.query;

     // Add the search stage
    console.log(req.query)
    try{
        pipeline.push({
            $search: {
                index: "search",
                text: {
                    query: query,
                    path: {
                        wildcard: "*"  // Search across all fields
                    }
                }
            }
        });
        if (startDate !== undefined && endDate !== undefined) {
            pipeline.push({
                $match: {
                    availabilityDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            });
        }

        // Add the sorting stage for rating
        pipeline.push({
            $sort: {
                rating: rating === 'asc' ? 1 : -1  // Sort by rating from highest to lowest
            }
        });

        if (startPrice !== undefined && endPrice !== undefined) {
            pipeline.push({
                $match: {
                    price: { $gte: startPrice, $lte: endPrice }
                }
            });
        }

        const ans = await Trainer.aggregate(pipeline)
        console.log("SNSSSSSSSSSSS", ans.length)
        res.status(200).json(ans)
    }catch(err){
        res.status(500).json({ message: 'Trainer not available' });
    }


})



export {
    searchTrainer
}