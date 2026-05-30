const InvoiceHeader = require('../models/InvoiceHeaderModel');
const mongoose = require('mongoose');

// Get all invoice headers
const getInvoiceHeaders = async (req, res) => {
  try {
    const invoices = await InvoiceHeader.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get InvoiceHeader by society ID
const getInvHeaderBySocietyId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const invheader = await InvoiceHeader.find({ societyId });

    res.status(200).json(invheader);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//create invhd by soceity Id
const createinvhdBysoceityId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const invhd = await InvoiceHeader.create({
      ...req.body,
      societyId,
    });

    res.status(201).json(invhd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//updateinvhdBySociety
const updateinvhdBySociety = async (req, res) => {
  try {
    const { societyId, invoiceherderId } = req.params;
    // 1. ID Validation ✅
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
      !mongoose.Types.ObjectId.isValid(invoiceherderId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await InvoiceHeader.findOneAndUpdate(
      { _id: invoiceherderId, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Invoice Header not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//deleteinvhdBySociety
const deleteinvhdBySociety = async (req, res) => {
  try {
    const { societyId, invoiceherderId } = req.params;

    // 1. ID Validation
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
      !mongoose.Types.ObjectId.isValid(invoiceherderId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deletedInvHd = await InvoiceHeader.findOneAndDelete(
      { _id: invoiceherderId, societyId: societyId }
    );

    if (!deletedInvHd) {
      return res.status(404).json({ error: 'Invoice Header not found in this society' });
    }

    res.status(200).json({ message: 'Invoice Header deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new invoice header
// const createInvoiceHeader = async (req, res) => {
//   try {
//     const invoicehd = new InvoiceHeader(req.body);
//     await invoicehd.save();
//     res.status(201).json(invoicehd);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };





// Get an invoice header by ID
// const getInvoiceHeaderById = async (req, res) => {
//   try {
//     const invoice = await InvoiceHeader.findById(req.params.id);
//     if (!invoice) return res.status(404).json({ message: 'Invoice header not found' });
//     res.status(200).json(invoice);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update an invoice header by ID
// const updateInvoiceHeader = async (req, res) => {
//   try {
//     const invoice = await InvoiceHeader.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!invoice) return res.status(404).json({ message: 'Invoice header not found' });
//     res.status(200).json(invoice);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete an invoice header by ID
// const deleteInvoiceHeader = async (req, res) => {
//   try {
//     const invoice = await InvoiceHeader.findByIdAndDelete(req.params.id);
//     if (!invoice) return res.status(404).json({ message: 'Invoice header not found' });
//     res.status(200).json({ message: 'Invoice header deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = {

  getInvHeaderBySocietyId,
  createinvhdBysoceityId,
  updateinvhdBySociety,
  deleteinvhdBySociety,
  getInvoiceHeaders,
  // createInvoiceHeader,
  // getInvoiceHeaderById,
  //  updateInvoiceHeader,
  // deleteInvoiceHeader
};
