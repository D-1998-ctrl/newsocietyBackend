const express = require('express');
const router = express.Router();
const {
    createPurchaseVoucher,
    getAllPurchaseVouchers,
    getPurchaseVoucherById,
    updatePurchaseVoucher,
    deletePurchaseVoucher
  } = require('../controllers/purchaseVoucherControllers'); 

// Create a new purchase voucher
router.post('/', createPurchaseVoucher);

// Get all purchase vouchers
router.get('/', getAllPurchaseVouchers);

// Get a single purchase voucher by ID
router.get('/:id', getPurchaseVoucherById);

// Update a purchase voucher by ID
router.put('/:id', updatePurchaseVoucher);

// Delete a purchase voucher by ID
router.delete('/:id', deletePurchaseVoucher);

module.exports = router;