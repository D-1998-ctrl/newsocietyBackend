const express = require('express');
const router = express.Router();
const {
   createAuditTemp,
  getAllAuditTemp,
  getAuditTempById,
  updateAuditTemp,
  deleteAuditTemp,
} = require('../controllers/AuditTempController'); 

// Create a new account group
router.post('/', createAuditTemp);

// Get all account groups
router.get('/', getAllAuditTemp);

// Get a single account group by ID
router.get('/:id', getAuditTempById);

// Update an account group by ID
router.patch('/:id', updateAuditTemp);

// Delete an account group by ID
router.delete('/:id', deleteAuditTemp);

module.exports = router;
