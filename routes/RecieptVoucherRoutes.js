const express = require("express");
const router = express.Router();
const receiptVoucherController = require("../controllers/RecieptVoucherControllers");

// POST: Create a new receipt voucher
router.post("/", receiptVoucherController.createReceiptVoucher);

// GET: Get all receipt vouchers
router.get("/", receiptVoucherController.getReceiptVouchers);

// GET: Get a single receipt voucher by ID
router.get("/:id", receiptVoucherController.getReceiptVoucherById);

// PUT: Update a receipt voucher by ID
router.put("/:id", receiptVoucherController.updateReceiptVoucher);

// DELETE: Delete a receipt voucher by ID
router.delete("/:id", receiptVoucherController.deleteReceiptVoucher);

module.exports = router;
