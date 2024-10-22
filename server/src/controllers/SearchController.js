import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";

// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const { domain, price } = req.query;
    console.log("QUERY ", req.query)
    try {
        let minPrice
        let maxPrice
        if(price){
            if (price.gte !== undefined) {
                minPrice = price.gte ? price.gte : undefined;
            }
            if (price.lte !== undefined) {
                maxPrice = price.lte ? price.lte : undefined;
            }
        }
        let pipeline = []
        if(domain){
            pipeline.push(
                {
                    $match: {
                      "trainingDomain.domain": {
                        $regex: new RegExp(domain, "i"),
                      },
                    },
                  }
            )
        }

        if(price && minPrice && maxPrice){
            pipeline.push({
                $project: {
                  trainingDomain: {
                    $filter: {
                      input: "$trainingDomain",
                      as: "td",
                      cond: {
                        $and: [
                          {
                            $regexMatch: {
                              input: "$$td.domain",
                              regex: new RegExp(domain, "i"),
                            },
                          },
                          {
                            $gte: ["$$td.price", Number(minPrice)],
                          },
                          {
                            $lte: ["$$td.price", Number(maxPrice)],
                          },
                        ],
                      },
                    },
                  },
                  generalDetails: 1,
                  bankDetails: 1,
                  trainerId: 1
                },
              })
        }else{
            pipeline.push(
                {
                    $project: {
                      trainingDomain: {
                        $filter: {
                          input: "$trainingDomain",
                          as: "td",
                          cond: {
                            $and: [
                              {
                                $regexMatch: {
                                  input: "$$td.domain",
                                  regex: new RegExp(domain, "i"),
                                },
                              }
                            ],
                          },
                        },
                      },
                      generalDetails: 1,
                      bankDetails: 1,
                      mainResume:1,
                      trainerId: 1
                    },
                  }
            )
        }

        // Remove Empty Results
        pipeline.push(            
            {
                $match: {
                    trainingDomain: { $ne: [] }
                }
        })

        //     {
        //       $match: {
        //         "trainingDomain.domain": {
        //           $regex: new RegExp(domain, "i"),
        //         },
        //       },
        //     },
        //     {
        //       $project: {
        //         trainingDomain: {
        //           $filter: {
        //             input: "$trainingDomain",
        //             as: "td",
        //             cond: {
        //               $and: [
        //                 {
        //                   $regexMatch: {
        //                     input: "$$td.domain",
        //                     regex: new RegExp(domain, "i"),
        //                   },
        //                 },
        //                 {
        //                   $gte: ["$$td.price", Number(minPrice)],
        //                 },
        //                 {
        //                   $lte: ["$$td.price", Number(maxPrice)],
        //                 },
        //               ],
        //             },
        //           },
        //         },
        //       },
        //     },
        //     {
        //         $match: {
        //             trainingDomain: { $ne: [] }
        //         }
        //     }
        //   ]

        // Define the aggregation pipeline
        // const pipeline = [{
        //             $match: {
        //                 'trainingDomain.domain': { $regex: new RegExp(domain, 'i') }
        //             }
        //         },
        //         {
        //             $project: {
        //                 trainingDomain: {
        //                     $filter: {
        //                         input: '$trainingDomain',
        //                         as: 'td',
        //                         cond: {
        //                             $and: [{
        //                                     $regexMatch: { input: '$$td.domain', regex: new RegExp(domain, 'i') }
        //                                 },
        //                                 // {
        //                                 //     $gte: { '$trainingDomain.price': minPrice }
        //                                 // }

        //                             ]
        //                         }

        //                     }
        //                 }
        //             }
        //         },
        //         {
        //             $match: {
        //                 trainingDomain: { $ne: [] }
        //             }
        //         }
        //     ]
            // [
            //     // Match documents where trainingDomain contains the specified domain
            //     {
            //         $match: {
            //             'trainingDomain.domain': { $regex: new RegExp(domain, 'i') }
            //         }
            //     },
            //     // Project to filter the trainingDomain array based on domain and price range
            //     {
            //         $project: {
            //             name: 1, // Include any other fields you need
            //             trainingDomain: {
            //                 $filter: {
            //                     input: '$trainingDomain',
            //                     as: 'td',
            //                     cond: {
            //                         $and: [
            //                             { $regexMatch: { input: '$$td.domain', regex: new RegExp(domain, 'i') } },
            //                             // { $gte: ["$$td.price", minPrice] },
            //                             // { $lte: ["$$td.price", maxPrice] }
            //                         ]
            //                     }
            //                 }
            //             },
            //             generalDetails: 1,
            //             bankDetails: 1,
            //             trainerId: 1
            //         }
            //     },
            //     // Ensure only documents with a non-empty trainingDomain array are returned
            //     {
            //         $match: {
            //             trainingDomain: { $ne: [] }
            //         }
            //     }
            // ];

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