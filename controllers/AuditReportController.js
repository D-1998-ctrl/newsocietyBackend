const mongoose = require('mongoose');

const AuditReport = require('../models/AuditReportModel');


const createAuditReport = async (req, res) => {
    try {
        const newReport = new AuditReport(req.body);
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// const getAllAuditReport = async (req, res) => {
//     try {
//         const reports = await AuditReport.find().populate("tempId").populate('societyId');
//         res.status(200).json(reports);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const getAllAuditReport = async (req, res) => {
    try {
        const reports = await AuditReport.find().populate("templates.tempId").populate('societyId');
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// const getAuditReportById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid ID format' });
//         }

//         const report = await AuditReport.findById(req.params.id).populate('tempId').populate('societyId');
//         if (!report) return res.status(404).json({ error: 'Audit report not found' });
//         res.status(200).json(template);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


const getAuditReportById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const report = await AuditReport.findById(req.params.id).populate('templates.tempId').populate('societyId');
        if (!report) return res.status(404).json({ error: 'Audit report not found' });
        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAuditReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

         const updatedReport = await AuditReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReport) return res.status(404).json({ error: 'Audit report not found' });

        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAuditReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const deletedReport = await AuditReport.findByIdAndDelete(req.params.id);

        if (!deletedReport) {
            return res.status(404).json({ error: 'AuditTemp not found' });
        }

        res.status(200).json({ message: 'AuditTemp deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAuditReport,
    getAllAuditReport,
    getAuditReportById,
    updateAuditReport,
    deleteAuditReport,
};