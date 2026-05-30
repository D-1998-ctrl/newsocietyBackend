const express = require('express');
const router = express.Router();
const paymentVoucherController = require('../controllers/paymentVoucherControllers');

router.get('/society/:societyId',paymentVoucherController.getPaymentVBySocietyId);
router.get('/', paymentVoucherController.getAllPaymentVouchers);
router.post("/society/:societyId/", paymentVoucherController.createPaymentVBySocietyId);
router.put("/society/:societyId/payment/:paymentvoucherID", paymentVoucherController.updatePVBySociety);
router.delete("/society/:societyId/payment/:paymentvoucherID",paymentVoucherController.deletePVBySociety);

// Create a new payment voucher
// router.post('/', paymentVoucherController.createPaymentVoucher);

// // Get a single payment voucher by ID
// router.get('/:id', paymentVoucherController.getPaymentVoucherById);

// // Update a payment voucher by ID
// router.put('/:id', paymentVoucherController.updatePaymentVoucher);

// // Delete a payment voucher by ID
// router.delete('/:id', paymentVoucherController.deletePaymentVoucher);

module.exports = router;