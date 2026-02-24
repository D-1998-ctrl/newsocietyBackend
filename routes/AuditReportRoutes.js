const express = require('express');
const router = express.Router();
const {
    createAuditReport,
    getAllAuditReport,
    getAuditReportById,
    updateAuditReport,
    deleteAuditReport,
} = require('../controllers/AuditReportController'); 

// Create a new account group
router.post('/',  createAuditReport);

// Get all account groups
router.get('/', getAllAuditReport);

// Get a single account group by ID
router.get('/:id', getAuditReportById);

// Update an account group by ID
router.patch('/:id', updateAuditReport);

// Delete an account group by ID
router.delete('/:id', deleteAuditReport);

module.exports = router;
