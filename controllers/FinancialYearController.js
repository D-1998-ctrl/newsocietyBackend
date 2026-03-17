const FinancialYear = require("../models/FinantialyearModel");

// Helper function to format date as DD-MM-YYYY
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// GET All Financial Years
const getFinancialYears = async (req, res) => {
    try {
        const years = await FinancialYear.find().sort({ fromDate: -1 });

        res.status(200).json({
            message: "Financial Years fetched successfully",
            data: years
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// CREATE Financial Year
const createFinancialYear = async (req, res) => {
    try {
        const { fromDate, toDate } = req.body;

        if (!fromDate || !toDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        const start = new Date(fromDate);
        const end = new Date(toDate);

        if (start >= end) {
            return res.status(400).json({ message: "End date must be greater than start date" });
        }

        const label = `${formatDate(start)} - ${formatDate(end)}`;

        const existing = await FinancialYear.findOne({ label });
        if (existing) {
            return res.status(400).json({ message: "Financial Year already exists" });
        }

        const newFY = await FinancialYear.create({
            fromDate: start,
            toDate: end,   // ✅ fixed
            label
        });

        res.status(201).json({
            message: "Financial Year created successfully",
            data: newFY
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
module.exports = {
    getFinancialYears,
    createFinancialYear,
   
}