const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const invoiceTemplateController = require('../controllers/invoiceTemplateController');

// Validation rules
const templateValidationRules = [
  check('name', 'Template name is required').not().isEmpty(),
  check('items', 'At least one item is required').isArray({ min: 1 }),
  check('items.*.serviceId', 'Service ID is required').not().isEmpty(),
  check('items.*.quantity', 'Quantity must be at least 1').isInt({ min: 1 })
];

// Routes
router.get('/', invoiceTemplateController.getAllTemplates);
router.get('/:id', invoiceTemplateController.getTemplateById);
router.post('/', templateValidationRules, invoiceTemplateController.createTemplate);
router.put('/:id', templateValidationRules, invoiceTemplateController.updateTemplate);
router.delete('/:id', invoiceTemplateController.deleteTemplate);

module.exports = router;