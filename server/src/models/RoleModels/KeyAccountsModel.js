import mongoose from "mongoose";


const KeyAccountsSchema = new mongoose.Schema({
    Projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }]
});

const KeyAccounts = mongoose.model('KeyAccounts', KeyAccountsSchema);
export default KeyAccounts