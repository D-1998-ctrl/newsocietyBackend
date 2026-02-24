const ReceiptVoucher = require("../models/RecieptVoucherModels");
const Voucher = require('../models/VoucherModel');

// Create a new receipt voucher
const createReceiptVoucher = async (req, res) => {
  console.log("Received data:", req.body); // Debugging
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
    });

    const savedVoucher = await newVoucher.save();
    // res.status(201).json(savedVoucher);
    console.log("savedVoucher", savedVoucher)

    // Step 2: Use voucher._id and amount to save in ReceiptVoucher
    const receipt = new Voucher({
      voucherId: savedVoucher._id,
      CrAmount: savedVoucher.crAmount,
      LedgerId: savedVoucher.crAccount,
      VoucherNumber: savedVoucher.receiptVoucherNumber,
      VoucherType: 'Receipt',
      EntryType: 'Credit'
    });

    const Drreceipt = new Voucher({
      voucherId: savedVoucher._id,
      DrAmount: savedVoucher.crAmount,
      LedgerId: savedVoucher.drAccount,
      VoucherNumber: savedVoucher.receiptVoucherNumber,
      VoucherType: 'Receipt',
      EntryType: 'Debit'
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

// Get all receipt vouchers
const getReceiptVouchers = async (req, res) => {
  try {
    const vouchers = await ReceiptVoucher.find();
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single receipt voucher by ID
const getReceiptVoucherById = async (req, res) => {
  try {
    const voucher = await ReceiptVoucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: "Receipt voucher not found" });
    }
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a receipt voucher by ID
const updateReceiptVoucher = async (req, res) => {
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

    const updatedVoucher = await ReceiptVoucher.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true } // To return the updated document
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Receipt voucher not found" });
    }

    res.json(updatedVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a receipt voucher by ID
const deleteReceiptVoucher = async (req, res) => {
  try {
    const deletedVoucher = await ReceiptVoucher.findByIdAndDelete(
      req.params.id
    );
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Receipt voucher not found" });
    }
    res.json({ message: "Receipt voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReceiptVoucher,
  getReceiptVouchers,
  getReceiptVoucherById,
  updateReceiptVoucher,
  deleteReceiptVoucher,
};
