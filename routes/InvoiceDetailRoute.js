const express = require('express');
const {

  getAllInvoiceDetails,
  getInvDetailsBySocietyId,
  createInvDetailsBysoceityId,
  updateinvdetailBySociety,
  deleteinvdetailBySociety,
  getByInvoiceId
  // createInvoiceDetail,
  // getInvoiceDetailById,
  // updateInvoiceDetail,
  // deleteInvoiceDetail,
  // getByInvoiceId 
} = require('../controllers/InvoiceDetailController');

const router = express.Router();

router.get('/society/:societyId', getInvDetailsBySocietyId);
router.post("/society/:societyId/", createInvDetailsBysoceityId);
router.put("/society/:societyId/invdetail/:invdetailId", updateinvdetailBySociety);
router.delete("/society/:societyId/invdetail/:invdetailId", deleteinvdetailBySociety);
router.get('/society/:societyId/invid/:invoiceId', getByInvoiceId)

router.get('/', getAllInvoiceDetails);
// router.post('/', createInvoiceDetail);
// router.get('/:id', getInvoiceDetailById);
// router.patch('/:invoiceId', updateInvoiceDetail);
// router.put('/:id', updateInvoiceDetail);
// router.delete('/:id', deleteInvoiceDetail);
// router.get('/InvoiceId/:invoiceId', getByInvoiceId); // Route to get by invoiceId


module.exports = router;



