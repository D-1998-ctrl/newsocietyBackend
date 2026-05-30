const express = require("express");
const router = express.Router();
const receiptVoucherController = require("../controllers/RecieptVoucherControllers");


router.get('/society/:societyId',receiptVoucherController.getReceiptVBysocietyId);

// POST: Create a new receipt voucher
router.post("/society/:societyId/", receiptVoucherController.createReceiptVoucher);

// GET: Get all receipt vouchers
router.get("/", receiptVoucherController.getReceiptVouchers);

router.put("/society/:societyId/receiptv/:receiptvoucherID",receiptVoucherController.updateReceiptVBySociety);
router.delete("/society/:societyId/receiptv/:receiptvoucherID",receiptVoucherController.deleteReceiptVBySociety);

// GET: Get a single receipt voucher by ID
// router.get("/:id", receiptVoucherController.getReceiptVoucherById);

// PUT: Update a receipt voucher by ID
// router.put("/:id", receiptVoucherController.updateReceiptVoucher);

// DELETE: Delete a receipt voucher by ID
//router.delete("/:id", receiptVoucherController.deleteReceiptVoucher);

module.exports = router;
