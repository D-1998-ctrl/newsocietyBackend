const express = require('express');
const router = express.Router();
const paymentVoucherController = require('../controllers/paymentVoucherControllers');

// Create a new payment voucher
router.post('/', paymentVoucherController.createPaymentVoucher);

// Get all payment vouchers
router.get('/', paymentVoucherController.getAllPaymentVouchers);

// Get a single payment voucher by ID
router.get('/:id', paymentVoucherController.getPaymentVoucherById);

// Update a payment voucher by ID
router.put('/:id', paymentVoucherController.updatePaymentVoucher);

// Delete a payment voucher by ID
router.delete('/:id', paymentVoucherController.deletePaymentVoucher);

module.exports = router;