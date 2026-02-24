const express = require('express');
const router = express.Router();
const {
    createSubGroup,
    getAllSubGroups,
    getSubGroupById,
    updateSubGroup,
    deleteSubGroup,
} = require('../controllers/AccountSubgroupController'); 

// Create a new account group
router.post('/subgroup', createSubGroup);

// Get all account groups
router.get('/subgroups', getAllSubGroups);

// Get a single account group by ID
router.get('/subgroups/:id', getSubGroupById);

// Update an account group by ID
router.patch('/subgroups/:id', updateSubGroup);

// Delete an account group by ID
router.delete('/subgroups/:id', deleteSubGroup);

module.exports = router;
