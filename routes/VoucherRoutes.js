const express = require('express');
const router = express.Router();
const {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  getVouchersByLedgerId,
  getAllVouchersByDate,
  updateVoucher,
  deleteVoucher,
groupByLedgerId
} = require('../controllers/VoucherController');

router.post('/', createVoucher);
router.get('/', getAllVouchers);
router.get('/trialbal', getAllVouchersByDate);
// router.get('/ledger', getVouchersByLedgerId); 
router.get('/:id', getVoucherById);
router.get('/ledger/:ledgerId', getVouchersByLedgerId);
// router.get('/', getAllVouchersByDate);
router.patch('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);
router.get('/legerId/:LedgerId', groupByLedgerId)

module.exports = router;
