const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/DemoInvoiceController');

// @route   GET /api/invoices
// @desc    Get all invoices
router.get('/', invoiceController.getInvoices);

// @route   GET /api/invoices/:id
// @desc    Get single invoice
router.get('/:id', invoiceController.getInvoiceById);

// @route   POST /api/invoices
// @desc    Create new invoice
router.post('/', invoiceController.createInvoice);

// @route   PUT /api/invoices/:id
// @desc    Update invoice
router.put('/:id', invoiceController.updateInvoice);

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

// @route   POST /api/invoices/send
// @desc    Send invoice emails
router.post('/send', invoiceController.sendInvoices);

module.exports = router;