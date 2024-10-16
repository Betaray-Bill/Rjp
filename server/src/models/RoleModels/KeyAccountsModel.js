import mongoose from "mongoose";


const KeyAccountsSchema = new mongoose.Schema({
    Deals: [{
        type: String
    }]
});

const KeyAccounts = mongoose.model('KeyAccounts', KeyAccountsSchema);
export default KeyAccounts