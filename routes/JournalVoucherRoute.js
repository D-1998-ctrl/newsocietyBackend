const JournalVoucherController = require('../controllers/JournalVoucherController');
const express = require("express");
const router = express.Router();

// Create a new Journal Voucher
router.post('/', JournalVoucherController.createJournalVoucher);

// Get all Journal Vouchers
router.get('/', JournalVoucherController.getAllJournalVouchers);

// Get a Journal Voucher by ID
router.get('/:id', JournalVoucherController.getJournalVoucherById);

// Update a Journal Voucher by ID
router.put('/:id', JournalVoucherController.updateJournalVoucher);

// Delete a Journal Voucher by ID
router.delete('/:id', JournalVoucherController.deleteJournalVoucher);


module.exports = router;   