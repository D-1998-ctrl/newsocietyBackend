const express = require('express');
const router = express.Router();
const {
  createAccountGroup,
  getAllAccountGroups,
  getAccountGroupById,
  updateAccountGroup,
  deleteAccountGroup,
} = require('../controllers/AccountGroupController'); 

// Create a new account group
router.post('/', createAccountGroup);

// Get all account groups
router.get('/', getAllAccountGroups);

// Get a single account group by ID
router.get('/:id', getAccountGroupById);

// Update an account group by ID
router.patch('/:id', updateAccountGroup);

// Delete an account group by ID
router.delete('/:id', deleteAccountGroup);

module.exports = router;
