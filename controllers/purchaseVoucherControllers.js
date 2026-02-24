const PurchaseVoucher = require('../models/purchaseVoucher');
const Voucher = require('../models/VoucherModel');

// Create a new purchase voucher
// exports.createPurchaseVoucher = async (req, res) => {
//   try {
//     const purchaseVoucher = new PurchaseVoucher(req.body);
//     await purchaseVoucher.save();
//     res.status(201).json({
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
const createPurchaseVoucher = async (req, res) => {
  console.log("Received data:", req.body); // Debugging
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
      isregisterd

    });

    const savedVoucher = await newVoucher.save();
    // res.status(201).json(savedVoucher);
    console.log("savedVoucher", savedVoucher)

    // Step 2: Use voucher._id and amount to save in ReceiptVoucher
    const purshase = new Voucher({
      voucherId: savedVoucher._id,
      CrAmount: savedVoucher.crTdsPayable,
      LedgerId: savedVoucher.crNameOfCreditor,
      VoucherNumber: savedVoucher.purchasevoucherNumber,
      VoucherType: 'Purchase',
      EntryType: 'Credit'
    });

    const Drpurshase = new Voucher({
      voucherId: savedVoucher._id,
      DrAmount: savedVoucher.amount,
      LedgerId: savedVoucher.drNameOfLedger,
      VoucherNumber: savedVoucher.purchasevoucherNumber,
      VoucherType: 'Purchase',
      EntryType: 'Debit'
    });

    const savedPurchase = await purshase.save();
    const savedDrPurchase = await Drpurshase.save();
    console.log('savedPurchase', savedPurchase)
    console.log('savedDrPurchase', savedDrPurchase)
    res.status(201).json({
      message: 'Voucher and Receipt saved successfully',
      voucher: savedVoucher,
      receipt: savedPurchase,
      Drreceipt: savedDrPurchase
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get all purchase vouchers
const getAllPurchaseVouchers = async (req, res) => {
  try {
    const purchaseVouchers = await PurchaseVoucher.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: purchaseVouchers.length,
      data: purchaseVouchers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// exports.getAllPurchaseVouchers = async (req, res) => {
//   try {
//     const purchaseVouchers = await PurchaseVoucher.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: purchaseVouchers.length,
//       data: purchaseVouchers
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// Get a single purchase voucher by ID
// exports.getPurchaseVoucherById = async (req, res) => {
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
const getPurchaseVoucherById = async (req, res) => {
  try {
    const purchaseVoucher = await PurchaseVoucher.findById(req.params.id);
    if (!purchaseVoucher) {
      return res.status(404).json({
        success: false,
        message: 'Purchase voucher not found'
      });
    }
    res.status(200).json({
      success: true,
      data: purchaseVoucher
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update a purchase voucher by ID
// exports.updatePurchaseVoucher = async (req, res) => {
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
const updatePurchaseVoucher = async (req, res) => {
  try {
    const purchaseVoucher = await PurchaseVoucher.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!purchaseVoucher) {
      return res.status(404).json({
        success: false,
        message: 'Purchase voucher not found'
      });
    }
    res.status(200).json({
      success: true,
      data: purchaseVoucher
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Delete a purchase voucher by ID
// exports.deletePurchaseVoucher = async (req, res) => {
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
// };
const deletePurchaseVoucher = async (req, res) => {
  try {
    const purchaseVoucher = await PurchaseVoucher.findByIdAndDelete(req.params.id);
    if (!purchaseVoucher) {
      return res.status(404).json({
        success: false,
        message: 'Purchase voucher not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
module.exports = {
  createPurchaseVoucher,
  getAllPurchaseVouchers,
  getPurchaseVoucherById,
  updatePurchaseVoucher,
  deletePurchaseVoucher
};
