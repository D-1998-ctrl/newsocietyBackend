const mongoose = require("mongoose");

const financialYearSchema = new mongoose.Schema({
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    label: {
        type: String,   // Example: 01-04-2025 - 31-03-2026
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("FinancialYear", financialYearSchema);