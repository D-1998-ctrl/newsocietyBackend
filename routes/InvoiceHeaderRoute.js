const express = require('express');
const {
  createInvoiceHeader,
  getInvoiceHeaders,
  getInvoiceHeaderById,
  updateInvoiceHeader,
  deleteInvoiceHeader
} = require('../controllers/InvoiceHeaderController');
const router = express.Router();

router.post('/', createInvoiceHeader);
router.get('/', getInvoiceHeaders);
router.get('/:id', getInvoiceHeaderById);
router.patch('/:id', updateInvoiceHeader);
router.delete('/:id', deleteInvoiceHeader);

module.exports = router;



