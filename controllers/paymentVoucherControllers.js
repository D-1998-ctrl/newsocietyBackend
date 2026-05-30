const PaymentVoucher = require('../models/paymentVoucherModel');
const Voucher = require('../models/VoucherModel');
const mongoose = require('mongoose');

// Get all payment vouchers
const getAllPaymentVouchers = async (req, res) => {
  try {
    const paymentVouchers = await PaymentVoucher.find()
      .populate("nameOfCreditor", "accountName")
      .populate("drName", "accountName ");
    // sort({ createdAt: -1 });
    res.json(paymentVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get  payment vouchers by society ID
const getPaymentVBySocietyId = async (req, res) => {
  try {
    const { societyId } = req.params;
    const paymentVouchers = await PaymentVoucher.find({ societyId })
      .populate("nameOfCreditor", "accountName")
      .populate("drName", "accountName ");
    // sort({ createdAt: -1 });
    res.json(paymentVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/// Create Payment Voucher by soceityId
const createPaymentVBySocietyId = async (req, res) => {
  const { societyId } = req.params;
  try {
    const {

      date,
      nameOfCreditor,
      amountPaidDr,
      previousOSBills,
      bank,
      drName,
      amountPaidCr,
      transactionType,
      instNo,
      chequeNo,
      instDate,
      narration
    } = req.body;

    const paymentVoucher = new PaymentVoucher({
      societyId,
      date,
      nameOfCreditor,
      amountPaidDr,
      previousOSBills,
      bank,
      drName,
      amountPaidCr,
      transactionType,
      instNo,
      chequeNo,
      instDate,
      narration
    });

    const savedPaymentVoucher = await paymentVoucher.save();
    console.log('savedPaymentVoucher', savedPaymentVoucher)
    // res.status(201).json(savedPaymentVoucher);


    // Step 2: Use voucher._id and amount to save in PaymentVoucher
    const Payment = new Voucher({
      voucherId: savedPaymentVoucher._id,
      CrAmount: savedPaymentVoucher.amountPaidCr,
      LedgerId: savedPaymentVoucher.nameOfCreditor,
      VoucherNumber: savedPaymentVoucher.PaymentVoucherNumber,
      VoucherType: 'Payment',
      EntryType: 'Credit',
      societyId
    });

    const DrPayment = new Voucher({
      voucherId: savedPaymentVoucher._id,
      DrAmount: savedPaymentVoucher.amountPaidDr,
      LedgerId: savedPaymentVoucher.drName,
      VoucherNumber: savedPaymentVoucher.PaymentVoucherNumber,
      VoucherType: 'Payment',
      EntryType: 'Debit',
      societyId
    });
    const savedPayment = await Payment.save();
    const savedDrPayment = await DrPayment.save();

    console.log('savedPayment', savedPayment)
    console.log('savedDrPayment', savedDrPayment)

    res.status(201).json({
      message: 'Payment saved successfully',
      voucher: savedPaymentVoucher,
      Payment: savedPayment,
      DrPayment: savedDrPayment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update payment Voucher by soceityId
const updatePVBySociety = async (req, res) => {
  try {
    const { societyId, paymentvoucherID } = req.params;
     // 1. ID Validation ✅
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(paymentvoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await PaymentVoucher.findOneAndUpdate(
      { _id: paymentvoucherID, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "payment voucher  not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//// Delete a payment Voucher by soceityId
const deletePVBySociety = async (req, res) => {
  try {
    const { societyId, paymentvoucherID } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(paymentvoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedpaymentvoucher = await PaymentVoucher.findOneAndDelete(
      { _id: paymentvoucherID, societyId: societyId }
    );

    if (!deletedpaymentvoucher) {
      return res.status(404).json({ error: 'payment Voucher not found in this society' });
    }

    res.status(200).json({ message: 'payment Voucher deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Create a new payment voucher
// const createPaymentVoucher = async (req, res) => {
//   try {
//     const {

//       date,
//       nameOfCreditor,
//       amountPaidDr,
//       previousOSBills,
//       bank,
//       drName,
//       amountPaidCr,
//       transactionType,
//       instNo,
//       chequeNo,
//       instDate,
//       narration
//     } = req.body;

//     const paymentVoucher = new PaymentVoucher({

//       date,
//       nameOfCreditor,
//       amountPaidDr,
//       previousOSBills,
//       bank,
//       drName,
//       amountPaidCr,
//       transactionType,
//       instNo,
//       chequeNo,
//       instDate,
//       narration
//     });

//     const savedPaymentVoucher = await paymentVoucher.save();
//     console.log('savedPaymentVoucher', savedPaymentVoucher)
//     // res.status(201).json(savedPaymentVoucher);


//     // Step 2: Use voucher._id and amount to save in PaymentVoucher
//     const Payment = new Voucher({
//       voucherId: savedPaymentVoucher._id,
//       CrAmount: savedPaymentVoucher.amountPaidCr,
//       LedgerId: savedPaymentVoucher.nameOfCreditor,
//       VoucherNumber: savedPaymentVoucher.PaymentVoucherNumber,
//       VoucherType: 'Payment',
//       EntryType: 'Credit'
//     });

//     const DrPayment = new Voucher({
//       voucherId: savedPaymentVoucher._id,
//       DrAmount: savedPaymentVoucher.amountPaidDr,
//       LedgerId: savedPaymentVoucher.drName,
//       VoucherNumber: savedPaymentVoucher.PaymentVoucherNumber,
//       VoucherType: 'Payment',
//       EntryType: 'Debit'
//     });
//     const savedPayment = await Payment.save();
//     const savedDrPayment = await DrPayment.save();

//     console.log('savedPayment', savedPayment)
//     console.log('savedDrPayment', savedDrPayment)

//     res.status(201).json({
//       message: 'Voucher and Payment saved successfully',
//       voucher: savedPaymentVoucher,
//       Payment: savedPayment,
//       DrPayment: savedDrPayment
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Get a single payment voucher by ID
// const getPaymentVoucherById = async (req, res) => {
//   try {
//     const paymentVoucher = await PaymentVoucher.findById(req.params.id);
//     if (!paymentVoucher) {
//       return res.status(404).json({ message: 'Payment voucher not found' });
//     }
//     res.json(paymentVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Update a payment voucher by ID
// const updatePaymentVoucher = async (req, res) => {
//   try {
//     const {
//       srNo,
//       date,
//       nameOfCreditor,
//       amountPaidDr,
//       previousOSBills,
//       bank,
//       drName,
//       amountPaidCr,
//       transactionType,
//       instNo,
//       chequeNo,
//       instDate,
//       narration
//     } = req.body;

//     const updatedPaymentVoucher = await PaymentVoucher.findByIdAndUpdate(
//       req.params.id,
//       {
//         srNo,
//         date,
//         nameOfCreditor,
//         amountPaidDr,
//         previousOSBills,
//         bank,
//         drName,
//         amountPaidCr,
//         transactionType,
//         instNo,
//         chequeNo,
//         instDate,
//         narration,
//         updatedAt: Date.now()
//       },
//       { new: true }
//     );

//     if (!updatedPaymentVoucher) {
//       return res.status(404).json({ message: 'Payment voucher not found' });
//     }
//     res.json(updatedPaymentVoucher);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Delete a payment voucher by ID
// const deletePaymentVoucher = async (req, res) => {
//   try {
//     const deletedPaymentVoucher = await PaymentVoucher.findByIdAndDelete(req.params.id);
//     if (!deletedPaymentVoucher) {
//       return res.status(404).json({ message: 'Payment voucher not found' });
//     }
//     res.json({ message: 'Payment voucher deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  getAllPaymentVouchers,
  getPaymentVBySocietyId,
  createPaymentVBySocietyId,
  updatePVBySociety,
  deletePVBySociety
   // createPaymentVoucher,
  // getPaymentVoucherById,
  // updatePaymentVoucher,
  // deletePaymentVoucher
};