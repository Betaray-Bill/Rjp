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
        // Search query
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

        // Add the Price based staging to the pipeline
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

        // Rating
        if (rating) {
            pipeline.push({
                $match: {
                    rating: {
                        $gte: Number(rating)
                    }
                }
            });
        }

        // Remove password projection
        pipeline.push({
            $project:{
                'password':0
            }
        })


        console.log("Pipelining : ", pipeline)

        const ans = await Trainer.aggregate(pipeline);
        console.log("ANSWER : ", ans.length)
        res.status(200).json(ans)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Trainer not available', err });
    }


})



export {
    searchTrainer
}