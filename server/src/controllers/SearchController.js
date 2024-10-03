import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";

// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const query = req.query.search
    console.log(query)
    let pipeline = [];

    const { startPrice, endPrice, startDate, endDate, rating } = req.query;

    // Add the search stage
    console.log(req.query)
    try {
        pipeline.push({
            $search: {
                index: "search",
                text: {
                    query: query,
                    path: {
                        wildcard: "*" // Search across all fields
                    }
                }
            }
        });
        // if (startDate && endDate) {
        //     pipeline.push({
        //         $match: {
        //             $expr: {
        //                 $not: {
        //                     $elemMatch: {
        //                         availableDate: {
        //                             $elemMatch: {
        //                                 $or: [
        //                                     // Check if there's an overlap with any available date ranges
        //                                     {
        //                                         $and: [
        //                                             { $lte: [new Date(startDate), "$availableDate.endDate"] },
        //                                             { $gte: [new Date(endDate), "$availableDate.startDate"] }
        //                                         ]
        //                                     }
        //                                 ]
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // }

        // Add the sorting stage for rating


        if (startPrice && endPrice) {
            console.log(startPrice, endPrice)
            pipeline.push({
                $match: {
                    "price.amount": {
                        $gte: Number(startPrice),
                        $lte: Number(endPrice)
                    }
                }
            });
        }

        if (rating) {
            pipeline.push({
                $sort: {
                    rating: rating === 'asc' ? 1 : -1 // Sort by rating from highest to lowest
                }
            });
        }
        console.log("Pipelining : ", pipeline)

        const ans = await Trainer.aggregate(pipeline);
        console.log("SNSSSSSSSSSSS", ans.length)
        res.status(200).json(ans)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Trainer not available', err });
    }


})



export {
    searchTrainer
}