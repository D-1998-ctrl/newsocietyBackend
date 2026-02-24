const express = require('express');
const router = express.Router();
const contraVoucherController = require('../controllers/contraVoucherControllers');

// Create a new contra voucher
router.post('/', contraVoucherController.createContraVoucher);

// Get all contra vouchers
router.get('/', contraVoucherController.getAllContraVouchers);

// Get a single contra voucher by ID
router.get('/:id', contraVoucherController.getContraVoucherById);

// Update a contra voucher by ID
router.put('/:id', contraVoucherController.updateContraVoucher);

// Delete a contra voucher by ID
router.delete('/:id', contraVoucherController.deleteContraVoucher);

module.exports = router;