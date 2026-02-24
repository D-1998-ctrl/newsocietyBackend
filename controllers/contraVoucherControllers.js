const ContraVoucher = require('../models/contraVoucherModels');
const Voucher = require('../models/VoucherModel');

// Create a new contra voucher
const createContraVoucher = async (req, res) => {
  try {
    const {
      srNo,
      date,
      bankFromWhichCashDebited,
      amountWithdrawn,
      previousOSBills,
      ledgerBankCashMoney,
      transactionType,
      instNo,
      chequeNo,
      instDate,
      bankName,
      branchName,
      narration,
      crNameOfCreditor,
      nameOfLedger,
      crAmountWithdraw,
      amount,
      branch
    } = req.body;

    const contraVoucher = new ContraVoucher({
      srNo,
      date,
      bankFromWhichCashDebited,
      amountWithdrawn,
      previousOSBills,
      ledgerBankCashMoney,
      transactionType,
      instNo,
      chequeNo,
      instDate,
      bankName,
      branchName,
      narration,
      crNameOfCreditor,
      nameOfLedger,
      crAmountWithdraw,
      amount,
      branch
    });

    const savedContraVoucher = await contraVoucher.save();
    console.log("savedContraVoucher", savedContraVoucher)

    // Step 2: Use voucher._id and amount to save in ReceiptVoucher
    const contra = new Voucher({
      voucherId: savedContraVoucher._id,
      CrAmount: savedContraVoucher.crAmountWithdraw,
      LedgerId: savedContraVoucher.crNameOfCreditor,
      VoucherNumber: savedContraVoucher.contraVoucherNumber,
      VoucherType: 'Contra',
       EntryType: 'Credit'
    });

    const Drcontra = new Voucher({
      voucherId: savedContraVoucher._id,
      DrAmount: savedContraVoucher.amountWithdrawn,
      LedgerId: savedContraVoucher.nameOfLedger,
      VoucherNumber: savedContraVoucher.contraVoucherNumber,
      VoucherType: 'Contra',
      EntryType: 'Debit'
    });

    const savedContra= await contra.save();
    const savedDrcontra = await Drcontra.save();
    console.log('contra', savedContra)
    console.log('savedDrcontra', savedDrcontra)
    res.status(201).json({
      message: 'Voucher and Receipt saved successfully',
      voucher: savedContraVoucher,
      receipt: savedContra,
      Drreceipt: savedDrcontra
    });

    // res.status(201).json(savedContraVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all contra vouchers
const getAllContraVouchers = async (req, res) => {
  try {
    const contraVouchers = await ContraVoucher.find();
    res.json(contraVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single contra voucher by ID
const getContraVoucherById = async (req, res) => {
  try {
    const contraVoucher = await ContraVoucher.findById(req.params.id);
    if (!contraVoucher) {
      return res.status(404).json({ message: 'Contra voucher not found' });
    }
    res.json(contraVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a contra voucher by ID
const updateContraVoucher = async (req, res) => {
  try {
    const {
      srNo,
      date,
      bankFromWhichCashDebited,
      amountWithdrawn,
      previousOSBills,
      ledgerBankCashMoney,
      transactionType,
      instNo,
      chequeNo,
      instDate,
      bankName,
      branchName,
      narration,
      crNameOfCreditor,
      nameOfLedger,
      crAmountWithdraw,
      amount,
      branch
    } = req.body;

    const updatedContraVoucher = await ContraVoucher.findByIdAndUpdate(
      req.params.id,
      {
        srNo,
        date,
        bankFromWhichCashDebited,
        amountWithdrawn,
        previousOSBills,
        ledgerBankCashMoney,
        transactionType,
        instNo,
        chequeNo,
        instDate,
        bankName,
        branchName,
        narration,
        crNameOfCreditor,
        nameOfLedger,
        crAmountWithdraw,
        amount,
        branch,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedContraVoucher) {
      return res.status(404).json({ message: 'Contra voucher not found' });
    }
    res.json(updatedContraVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a contra voucher by ID
const deleteContraVoucher = async (req, res) => {
  try {
    const deletedContraVoucher = await ContraVoucher.findByIdAndDelete(req.params.id);
    if (!deletedContraVoucher) {
      return res.status(404).json({ message: 'Contra voucher not found' });
    }
    res.json({ message: 'Contra voucher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContraVoucher,
  getAllContraVouchers,
  getContraVoucherById,
  updateContraVoucher,
  deleteContraVoucher
};