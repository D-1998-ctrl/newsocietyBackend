const PurchaseVoucher = require('../models/purchaseVoucher');
const Voucher = require('../models/VoucherModel');
const mongoose = require('mongoose');



// Get all purchase vouchers
const getAllPurchaseVouchers = async (req, res) => {
  try {
    const purchaseVouchers = await PurchaseVoucher.find() 
    .populate("crNameOfCreditor", "accountName")
      .populate("drNameOfLedger", "accountName ");
    res.status(200).json(purchaseVouchers);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get all purchase vouchers
const getPVBySocietyId = async (req, res) => {
  try {
    const { societyId } = req.params;
    const purchaseVouchers = await PurchaseVoucher.find({societyId}) 
    .populate("crNameOfCreditor", "accountName")
      .populate("drNameOfLedger", "accountName ");
    res.status(200).json(purchaseVouchers);
  } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Create  purchase voucher
const createPVBysoceityId = async (req, res) => {
  console.log("Received data:", req.body); 
   const { societyId } = req.params;
  try {
    const {
      date,
      refBillNo,
      drNameOfLedger,
      crTdsPayable,
      sgst,
      billDate,
      crNameOfCreditor,
      amountOfBill,
      amount,
      cgst,
      billPeriod,
      narration,
      customerNo,
     isregisterd,
    } = req.body;

    const newVoucher = new PurchaseVoucher({
      date,
      refBillNo,
      drNameOfLedger,
      crTdsPayable,
      sgst,
      billDate,
      crNameOfCreditor,
      amountOfBill,
      amount,
      cgst,
      billPeriod,
      narration,
      customerNo,
      isregisterd,
      societyId


    });

    const savedVoucher = await newVoucher.save();
    // res.status(201).json(savedVoucher);
    console.log("savedVoucher", savedVoucher)
    const purshase = new Voucher({
      voucherId: savedVoucher._id,
      CrAmount: savedVoucher.crTdsPayable,
      LedgerId: savedVoucher.crNameOfCreditor,
      VoucherNumber: savedVoucher.purchasevoucherNumber,
      VoucherType: 'Purchase',
      EntryType: 'Credit',
      societyId
    });

    const Drpurshase = new Voucher({
      voucherId: savedVoucher._id,
      DrAmount: savedVoucher.amount,
      LedgerId: savedVoucher.drNameOfLedger,
      VoucherNumber: savedVoucher.purchasevoucherNumber,
      VoucherType: 'Purchase',
      EntryType: 'Debit',
      societyId
    });

    const savedPurchase = await purshase.save();
    const savedDrPurchase = await Drpurshase.save();
    console.log('savedPurchase', savedPurchase)
    console.log('savedDrPurchase', savedDrPurchase)
    res.status(201).json({
      message: 'PurchaseVoucher saved successfully',
      voucher: savedVoucher,
      receipt: savedPurchase,
      Drreceipt: savedDrPurchase
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update purchase Voucher by soceityId
const updatePVBySociety = async (req, res) => {
  try {
    const { societyId, purchasevoucherID } = req.params;
     // 1. ID Validation ✅
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(purchasevoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await PurchaseVoucher.findOneAndUpdate(
      { _id: purchasevoucherID, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "purchase voucher  not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//// Delete a purchase Voucher by soceityId
const deletePVBySociety = async (req, res) => {
  try {
    const { societyId, purchasevoucherID } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(purchasevoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedpurchasevoucher = await PurchaseVoucher.findOneAndDelete(
      { _id: purchasevoucherID, societyId: societyId }
    );

    if (!deletedpurchasevoucher) {
      return res.status(404).json({ error: 'purchase Voucher not found in this society' });
    }

    res.status(200).json({ message: 'purchase Voucher deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// // Create a new purchase voucher
// const createPurchaseVoucher = async (req, res) => {
//   console.log("Received data:", req.body); // Debugging
//   try {
//     const {
//       date,
//       refBillNo,
//       drNameOfLedger,
//       crTdsPayable,
//       sgst,
//       billDate,
//       crNameOfCreditor,
//       amountOfBill,
//       amount,
//       cgst,
//       billPeriod,
//       narration,
//       customerNo,
//      isregisterd,
//     } = req.body;

//     const newVoucher = new PurchaseVoucher({
//       date,
//       refBillNo,
//       drNameOfLedger,
//       crTdsPayable,
//       sgst,
//       billDate,
//       crNameOfCreditor,
//       amountOfBill,
//       amount,
//       cgst,
//       billPeriod,
//       narration,
//       customerNo,
//       isregisterd

//     });

//     const savedVoucher = await newVoucher.save();
//     // res.status(201).json(savedVoucher);
//     console.log("savedVoucher", savedVoucher)

//     // Step 2: Use voucher._id and amount to save in ReceiptVoucher
//     const purshase = new Voucher({
//       voucherId: savedVoucher._id,
//       CrAmount: savedVoucher.crTdsPayable,
//       LedgerId: savedVoucher.crNameOfCreditor,
//       VoucherNumber: savedVoucher.purchasevoucherNumber,
//       VoucherType: 'Purchase',
//       EntryType: 'Credit'
//     });

//     const Drpurshase = new Voucher({
//       voucherId: savedVoucher._id,
//       DrAmount: savedVoucher.amount,
//       LedgerId: savedVoucher.drNameOfLedger,
//       VoucherNumber: savedVoucher.purchasevoucherNumber,
//       VoucherType: 'Purchase',
//       EntryType: 'Debit'
//     });

//     const savedPurchase = await purshase.save();
//     const savedDrPurchase = await Drpurshase.save();
//     console.log('savedPurchase', savedPurchase)
//     console.log('savedDrPurchase', savedDrPurchase)
//     res.status(201).json({
//       message: 'Voucher and Receipt saved successfully',
//       voucher: savedVoucher,
//       receipt: savedPurchase,
//       Drreceipt: savedDrPurchase
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getPurchaseVoucherById = async (req, res) => {
//   try {
//     const purchaseVoucher = await PurchaseVoucher.findById(req.params.id);
//     if (!purchaseVoucher) {
//       return res.status(404).json({
//         success: false,
//         message: 'Purchase voucher not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: purchaseVoucher
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };


// const updatePurchaseVoucher = async (req, res) => {
//   try {
//     const purchaseVoucher = await PurchaseVoucher.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     );
//     if (!purchaseVoucher) {
//       return res.status(404).json({
//         success: false,
//         message: 'Purchase voucher not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: purchaseVoucher
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// Delete a purchase voucher by ID
// const deletePurchaseVoucher = async (req, res) => {
//   try {
//     const purchaseVoucher = await PurchaseVoucher.findByIdAndDelete(req.params.id);
//     if (!purchaseVoucher) {
//       return res.status(404).json({
//         success: false,
//         message: 'Purchase voucher not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: {}
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// }
module.exports = {
  getPVBySocietyId,
  createPVBysoceityId,
  updatePVBySociety,
  // createPurchaseVoucher,
  getAllPurchaseVouchers,
  deletePVBySociety,
  // getPurchaseVoucherById,
  // updatePurchaseVoucher,
  // deletePurchaseVoucher
};
