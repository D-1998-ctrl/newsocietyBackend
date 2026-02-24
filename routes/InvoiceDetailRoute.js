const express = require('express');
const {
    createInvoiceDetail,
  getAllInvoiceDetails,
  getInvoiceDetailById,
  updateInvoiceDetail,
  deleteInvoiceDetail,
  getByInvoiceId 
} = require('../controllers/InvoiceDetailController');

const router = express.Router();

router.post('/', createInvoiceDetail);
router.get('/', getAllInvoiceDetails);
router.get('/:id', getInvoiceDetailById);
// router.patch('/:invoiceId', updateInvoiceDetail);
router.put('/:id', updateInvoiceDetail);
router.delete('/:id', deleteInvoiceDetail);
router.get('/InvoiceId/:invoiceId', getByInvoiceId); // Route to get by invoiceId


module.exports = router;



