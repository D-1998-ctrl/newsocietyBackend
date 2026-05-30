const JournalVoucherController = require('../controllers/JournalVoucherController');
const express = require("express");
const router = express.Router();

//Get all Journal by societyId 
router.get('/society/:societyId',JournalVoucherController.getJVBySocietyId);
router.post("/society/:societyId/", JournalVoucherController.createJVBysoceityId);
router.put("/society/:societyId/jv/:journalvoucherID",JournalVoucherController.updateJVBySociety);
router.delete("/society/:societyId/jv/:journalvoucherID",JournalVoucherController.deleteJVBySociety);
router.get('/', JournalVoucherController.getAllJournalVouchers);



// Create a new Journal Voucher
// router.post('/', JournalVoucherController.createJournalVoucher);
// Get a Journal Voucher by ID
// router.get('/:id', JournalVoucherController.getJournalVoucherById);

// Update a Journal Voucher by ID
// router.put('/:id', JournalVoucherController.updateJournalVoucher);

// Delete a Journal Voucher by ID
// router.delete('/:id', JournalVoucherController.deleteJournalVoucher);


module.exports = router;   