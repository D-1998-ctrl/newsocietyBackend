const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const demoMemberController = require('../controllers/demoMemberControllers');

// Validation rules
const demoMemberValidationRules = [
  check('firstName', 'First name is required').not().isEmpty().trim(),
  check('lastName', 'Last name is required').not().isEmpty().trim(),
  check('area', 'Area is required').not().isEmpty().trim(),
  check('cc', 'CC is required').not().isEmpty().trim(),
  check('invoices', 'Invoices must be an array').optional().isArray(),
  check('invoices.*', 'Invalid invoice ID').optional().isMongoId()
];

// Routes
router.get('/', demoMemberController.getAllDemoMembers);
router.get('/:id', demoMemberController.getDemoMemberById);
router.post('/', demoMemberValidationRules, demoMemberController.createDemoMember);
router.put('/:id', demoMemberValidationRules, demoMemberController.updateDemoMember);
router.delete('/:id', demoMemberController.deleteDemoMember);

module.exports = router;