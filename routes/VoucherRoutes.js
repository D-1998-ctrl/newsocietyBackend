const express = require('express');
const router = express.Router();
const {
  getAllVouchers,
  getVouchersBySocietyId,
  createVouchersBysoceityId,
  getVoucherById,
  getVouchersByLedgerId,
  updateVouchersBySociety,
  deleteVouchersBySociety,
  getAllVouchersByDate,
  getBalancesheetByDate
  // createVoucher,
  // getAllVouchersByDate,
  // updateVoucher,
  // deleteVoucher,
  //  groupByLedgerId
} = require('../controllers/VoucherController');

router.get('/', getAllVouchers);
router.get('/society/:societyId', getVouchersBySocietyId);
router.post("/society/:societyId/", createVouchersBysoceityId);
router.get('/society/:societyId/:id', getVoucherById);
router.get('/society/:societyId/ledger/:ledgerId', getVouchersByLedgerId);
router.put("/society/:societyId/vouchers/:voucherId", updateVouchersBySociety);
router.delete("/society/:societyId/vouchers/:voucherId", deleteVouchersBySociety);
 router.get('/trialbal/:societyId', getBalancesheetByDate);
router.get('/trialbal/', getAllVouchersByDate);



// router.post('/', createVoucher);
// router.get('/trialbal', getAllVouchersByDate);
// router.get('/ledger', getVouchersByLedgerId); 
// router.get('/:id', getVoucherById);
// router.get('/ledger/:ledgerId', getVouchersByLedgerId);
// router.get('/', getAllVouchersByDate);
// router.patch('/:id', updateVoucher);
// router.delete('/:id', deleteVoucher);
// router.get('/legerId/:LedgerId', groupByLedgerId)

module.exports = router;
