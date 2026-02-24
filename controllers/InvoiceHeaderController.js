const InvoiceHeader = require('../models/InvoiceHeaderModel');


// Create a new invoice header

const createInvoiceHeader = async (req, res) => {
  try {
    const invoicehd = new InvoiceHeader(req.body);
    await invoicehd.save();
    res.status(201).json(invoicehd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// const createInvoiceHeader = async (req, res) => {
//   try {
//     console.log("REQ BODY:", req.body); // 👈 ADD THIS

//     const {
//       invoiceDate,
//       memberId,
//       period,
//       dueDate,
//       amtInWords,
//       narration,
//       billinvoiceNumber
//     } = req.body;



//     const newInvoice = await InvoiceHeader.create({
//       invoiceDate,
//       memberId,
//       period,
//       dueDate,
//       amtInWords,
//       narration,
//       billinvoiceNumber
//     });

//     return res.status(201).json({
//       success: true,
//       newInvoice
//     });

//   } catch (error) {
//     console.error("CREATE INVOICE ERROR:", error); // 👈 CRITICAL
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };



// Get all invoice headers
const getInvoiceHeaders = async (req, res) => {
  try {
    const invoices = await InvoiceHeader.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getInvoiceHeaders = async (req, res) => {
//   try {
//     const invoices = await InvoiceHeader.find().populate({
//       path: 'memberId',
//        select: 'firstName middleName surname'
//     });
//     res.status(200).json(invoices);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get an invoice header by ID
const getInvoiceHeaderById = async (req, res) => {
  try {
    const invoice = await InvoiceHeader.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice header not found' });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an invoice header by ID
const updateInvoiceHeader = async (req, res) => {
  try {
    const invoice = await InvoiceHeader.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice header not found' });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an invoice header by ID
const deleteInvoiceHeader = async (req, res) => {
  try {
    const invoice = await InvoiceHeader.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice header not found' });
    res.status(200).json({ message: 'Invoice header deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInvoiceHeader,
  getInvoiceHeaders,
  getInvoiceHeaderById,
  updateInvoiceHeader,
  deleteInvoiceHeader
};
