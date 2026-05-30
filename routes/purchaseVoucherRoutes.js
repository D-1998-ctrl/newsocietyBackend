const express = require('express');
const router = express.Router();
const {
  getAllPurchaseVouchers,
  getPVBySocietyId,
  createPVBysoceityId,
  updatePVBySociety,
  deletePVBySociety,
  // deletePurchaseVoucher
  // createPurchaseVoucher,
  // getPurchaseVoucherById,
  // updatePurchaseVoucher,
} = require('../controllers/purchaseVoucherControllers');

router.get('/', getAllPurchaseVouchers);
router.get('/society/:societyId', getPVBySocietyId);
router.post("/society/:societyId/", createPVBysoceityId);
router.put("/society/:societyId/pv/:purchasevoucherID", updatePVBySociety);
router.delete("/society/:societyId/pv/:purchasevoucherID", deletePVBySociety);


// Create a new purchase voucher
// router.post('/', createPurchaseVoucher);



// // Get a single purchase voucher by ID
// router.get('/:id', getPurchaseVoucherById);

// Update a purchase voucher by ID
// router.put('/:id', updatePurchaseVoucher);

// Delete a purchase voucher by ID
// router.delete('/:id', deletePurchaseVoucher);

module.exports = router;