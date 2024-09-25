import asyncHandler from "../utils/asyncHandler.js";
import Trainer from "../models/TrainerModel.js";

// Search Function
const searchTrainer = asyncHandler(async(req, res) => {
    const s = req.query.search
    console.log(s)
    const ans = await Trainer.aggregate([{
        $search: {
            index: "search",
            text: {
                query: s,
                path: {
                    wildcard: "*"
                }
            }
        }
    }])
    console.log("SNSSSSSSSSSSS", ans.length)

    if (!ans) {
        res.status(500).json({ message: 'Trainer not available' });
    }

    res.status(200).json(ans)
})



export {
    searchTrainer
}