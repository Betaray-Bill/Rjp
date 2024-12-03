const { Schema } = require("mongoose");

const GlobalSettingsSchema = new Schema({
    poNumber: { type: Number, default: 0 }, // Counter for PO numbers
    invoiceNumber: { type: Number, default: 0 }, // Add more counters as needed
});

// module.exports = mongoose.model('GlobalSettings', GlobalSettingsSchema);
const GlobalModel = mongoose.model('GlobalModel', GlobalSettingsSchema);


// Ensure only one document exists
GlobalModel.pre('save', async function(next) {
    const existing = await this.constructor.findOne();
    if (existing && existing._id.toString() !== this._id.toString()) {
        throw new Error('Only one GlobalSettings document is allowed.');
    }
    next();
});