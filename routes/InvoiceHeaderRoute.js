const express = require('express');
const {
  getInvHeaderBySocietyId,
  createinvhdBysoceityId,
  updateinvhdBySociety,
  deleteinvhdBySociety,
  getInvoiceHeaders,
    // createInvoiceHeader,
  // getInvoiceHeaderById,
  //  updateInvoiceHeader,
  // deleteInvoiceHeader,
} = require('../controllers/InvoiceHeaderController');
const router = express.Router();
router.get('/society/:societyId', getInvHeaderBySocietyId);
router.post("/society/:societyId/", createinvhdBysoceityId);
router.put("/society/:societyId/invoiceheader/:invoiceherderId", updateinvhdBySociety);
router.delete("/society/:societyId/invoiceheader/:invoiceherderId", deleteinvhdBySociety);
router.get('/', getInvoiceHeaders)
// router.post('/', createInvoiceHeader);
// router.get('/:id', getInvoiceHeaderById);
//  router.patch('/:id', updateInvoiceHeader);
// router.delete('/:id', deleteInvoiceHeader);

module.exports = router;



