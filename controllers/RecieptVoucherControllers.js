const ReceiptVoucher = require("../models/RecieptVoucherModels");
const Voucher = require('../models/VoucherModel');
const mongoose = require('mongoose');


// Get all receipt vouchers
const getReceiptVouchers = async (req, res) => {
  try {
    const vouchers = await ReceiptVoucher.find()
      .populate({
        path: "referenceInvoice",
        model: "InvoiceHeader",
        select: "narration"
      });

    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all receipt vouchers by societyId
const getReceiptVBysocietyId = async (req, res) => {
  try {
    const { societyId } = req.params; // get from URL

    const vouchers = await ReceiptVoucher.find({ societyId })
      .populate({
        path: "referenceInvoice",
        model: "InvoiceHeader",
        select: "narration"
      });

    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new receipt voucher
const createReceiptVoucher = async (req, res) => {
  console.log("Received data:", req.body); // Debugging
  const { societyId } = req.params;
  try {
    const {
      voucherDate,
      narration,
      drAccount,
      crAccount,
      crAmount,
      referenceInvoice,
      transactionType,
      instrumentNumber,
      instrumentDate,
      instrumentBank,
      instrumentBranch,
    } = req.body;

    const newVoucher = new ReceiptVoucher({
      voucherDate,
      narration,
      drAccount,
      crAccount,
      crAmount,
      referenceInvoice,
      transactionType,
      instrumentNumber,
      instrumentDate,
      instrumentBank,
      instrumentBranch,
      societyId
    });

    const savedVoucher = await newVoucher.save();
    // res.status(201).json(savedVoucher);
    console.log("savedVoucher", savedVoucher)

    // Step 2: Use voucher._id and amount to save in ReceiptVoucher
    const receipt = new Voucher({
      voucherId: savedVoucher._id,
      CrAmount: savedVoucher.crAmount,
      LedgerId: savedVoucher.crAccount._id,
      VoucherNumber: savedVoucher.receiptVoucherNumber,
      VoucherType: 'Receipt',
      EntryType: 'Credit',
      societyId
    });

    const Drreceipt = new Voucher({
      voucherId: savedVoucher._id,
      DrAmount: savedVoucher.crAmount,
      LedgerId: savedVoucher.drAccount._id,
      VoucherNumber: savedVoucher.receiptVoucherNumber,
      VoucherType: 'Receipt',
      EntryType: 'Debit',
      societyId
    });

    const savedReceipt = await receipt.save();
    const savedDrReceipt = await Drreceipt.save();
    console.log('receipt', savedReceipt)
    console.log('savedDrReceipt', savedDrReceipt)
    res.status(201).json({
      message: 'Voucher and Receipt saved successfully',
      voucher: savedVoucher,
      receipt: savedReceipt,
      Drreceipt: savedDrReceipt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Receipt Voucher by soceityId
const updateReceiptVBySociety = async (req, res) => {
  try {
    const { societyId, receiptvoucherID } = req.params;
     
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(receiptvoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await ReceiptVoucher.findOneAndUpdate(
      { _id: receiptvoucherID, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Receipt voucher  not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//// Delete a Receipt Voucher by soceityId
const deleteReceiptVBySociety = async (req, res) => {
  try {
    const { societyId, receiptvoucherID } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(receiptvoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedReceiptvoucher = await ReceiptVoucher.findOneAndDelete(
      { _id: receiptvoucherID, societyId: societyId }
    );

    if (!deletedReceiptvoucher) {
      return res.status(404).json({ error: 'Receipt Voucher not found in this society' });
    }

    res.status(200).json({ message: 'Receipt Voucher deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// // Get a single receipt voucher by ID
// const getReceiptVoucherById = async (req, res) => {
//   try {
//     const voucher = await ReceiptVoucher.findById(req.params.id);
//     if (!voucher) {
//       return res.status(404).json({ message: "Receipt voucher not found" });
//     }
//     res.json(voucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a receipt voucher by ID
// const updateReceiptVoucher = async (req, res) => {
//   try {
//     const {
//       voucherDate,
//       narration,
//       drAccount,
//       crAccount,
//       crAmount,
//       referenceInvoice,
//       transactionType,
//       instrumentNumber,
//       instrumentDate,
//       instrumentBank,
//       instrumentBranch,
//     } = req.body;

//     const updatedVoucher = await ReceiptVoucher.findByIdAndUpdate(
//       req.params.id,
//       {
//         voucherDate,
//         narration,
//         drAccount,
//         crAccount,
//         crAmount,
//         referenceInvoice,
//         transactionType,
//         instrumentNumber,
//         instrumentDate,
//         instrumentBank,
//         instrumentBranch,
//       },
//       { new: true } // To return the updated document
//     );

//     if (!updatedVoucher) {
//       return res.status(404).json({ message: "Receipt voucher not found" });
//     }

//     res.json(updatedVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a receipt voucher by ID
// const deleteReceiptVoucher = async (req, res) => {
//   try {
//     const deletedVoucher = await ReceiptVoucher.findByIdAndDelete(
//       req.params.id
//     );
//     if (!deletedVoucher) {
//       return res.status(404).json({ message: "Receipt voucher not found" });
//     }
//     res.json({ message: "Receipt voucher deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  getReceiptVBysocietyId,
  createReceiptVoucher,
  getReceiptVouchers,
  updateReceiptVBySociety,
  deleteReceiptVBySociety,
  // getReceiptVoucherById,
  // updateReceiptVoucher,
  // deleteReceiptVoucher,
};
