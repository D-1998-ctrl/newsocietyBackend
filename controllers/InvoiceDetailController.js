const InvoiceDetail = require('../models/InvoiceDetailModel');

// Create a new Invoice Detail
const createInvoiceDetail = async (req, res) => {
  try {
    const invoiceDetail = new InvoiceDetail(req.body);
    await invoiceDetail.save();
    res.status(201).json(invoiceDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Invoice Details
const getAllInvoiceDetails = async (req, res) => {
  try {
    const invoiceDetails = await InvoiceDetail.find();
    res.status(200).json(invoiceDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Invoice Detail by ID
const getInvoiceDetailById = async (req, res) => {
  try {
    const invoiceDetail = await InvoiceDetail.findById(req.params.id);
    if (!invoiceDetail) {
      return res.status(404).json({ message: 'Invoice Detail not found' });
    }
    res.status(200).json(invoiceDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Invoice Details by invoiceId (Reference to InvoiceHeader)
const getByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    // Fetch all invoice details matching the given invoiceId
    const invoiceDetails = await InvoiceDetail.find({ invoiceId });

    if (!invoiceDetails.length) {
      return res.status(404).json({ message: 'No Invoice Details found for this Invoice ID' });
    }

    res.status(200).json(invoiceDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Invoice Detail
// const updateInvoiceDetail = async (req, res) => {
//   try {
//     const { invoiceId } = req.params; // Extract invoiceId from URL params
//     const { serviceIds, amounts } = req.body; // Extract updated details

//     // Validate input data
//     if (!Array.isArray(serviceIds) || !Array.isArray(amounts) || serviceIds.length !== amounts.length) {
//       return res.status(400).json({ error: 'Invalid data format. serviceIds and amounts must be arrays of equal length.' });
//     }

//     // Find existing InvoiceDetail by invoiceId
//     const invoiceDetail = await InvoiceDetail.findOne({ invoiceId });

//     if (!invoiceDetail) {
//       return res.status(404).json({ message: 'Invoice Details not found for the given invoiceId' });
//     }

//     // Update fields
//     invoiceDetail.serviceIds = serviceIds;
//     invoiceDetail.amounts = amounts;

//     // Save updated details
//     await invoiceDetail.save();

//     res.status(200).json({ message: 'Invoice Details updated successfully', updatedDetails: invoiceDetail });

//   } catch (error) {
//     console.error('❌ Error updating Invoice Details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const updateInvoiceDetail = async (req, res) => {
  try {
    const { id } = req.params; // _id from URL
    const { invoiceId, serviceIds, amounts } = req.body;

    const updatedDetail = await InvoiceDetail.findByIdAndUpdate(
      id,
      {
        invoiceId,
        serviceIds,
        amounts,
      },
      {
        new: true,        // return updated document
        runValidators: true,
      }
    );

    if (!updatedDetail) {
      return res.status(404).json({
        success: false,
        message: "Invoice detail not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice detail updated successfully",
      data: updatedDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating invoice detail",
      error: error.message,
    });
  }
};

// Delete an Invoice Detail
const deleteInvoiceDetail = async (req, res) => {
  try {
    const invoiceDetail = await InvoiceDetail.findByIdAndDelete(req.params.id);
    if (!invoiceDetail) {
      return res.status(404).json({ message: 'Invoice Detail not found' });
    }
    res.status(200).json({ message: 'Invoice Detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all functions
module.exports = {
  createInvoiceDetail,
  getAllInvoiceDetails,
  getInvoiceDetailById,
  getByInvoiceId,
  updateInvoiceDetail,
  deleteInvoiceDetail,
};
