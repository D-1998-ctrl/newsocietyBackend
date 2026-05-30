const JournalVoucher = require("../models/JournalVouchermodel")
const Voucher = require('../models/VoucherModel');
const mongoose = require('mongoose');

//get all jv
const getAllJournalVouchers = async (req, res) => {
    try {
        const vouchers = await JournalVoucher.find()
            .populate("debitLedger", "accountName drOrCr")
            .populate("creditLedger", "accountName drOrCr");

        res.status(200).json(vouchers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get JV by society ID
const getJVBySocietyId = async (req, res) => {
    try {
        const { societyId } = req.params; // or req.query

        const vouchers = await JournalVoucher.find({ societyId })
            .populate("debitLedger", "accountName drOrCr")
            .populate("creditLedger", "accountName drOrCr");

        res.status(200).json(vouchers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

/// Create Journal Voucher by soceityId
const createJVBysoceityId = async (req, res) => {
    console.log(req.body)
    const { societyId } = req.params;
    try {
        const {
            date,
            debitLedger,
            creditLedger,
            debitAmount,
            creditAmount,
            narration,

        } = req.body;

        // Basic validation (can be extended)
        if (!date) {
            return res.status(400).json({ error: 'Date is required.' });
        }

        const newVoucher = new JournalVoucher({
            date,
            debitLedger,
            creditLedger,
            debitAmount,
            creditAmount,
            narration,
            societyId
        });

        const savedVoucher = await newVoucher.save();
        console.log("savedVoucher", savedVoucher)
        //   res.status(201).json(savedVoucher);
        const CrJV = new Voucher({
            voucherId: savedVoucher._id,
            CrAmount: savedVoucher.creditAmount,
            LedgerId: savedVoucher.creditLedger,
            VoucherNumber: savedVoucher.JournalVoucherNumber,
            VoucherType: 'JV',
            EntryType: 'Credit',
            societyId

        });

        const DrJV = new Voucher({
            voucherId: savedVoucher._id,
            DrAmount: savedVoucher.debitAmount,
            LedgerId: savedVoucher.debitLedger,
            VoucherNumber: savedVoucher.JournalVoucherNumber,
            VoucherType: 'JV',
            EntryType: 'Debit',
            societyId
        });
        const savedCrJV = await CrJV.save();
        const savedDrJV = await DrJV.save();
        console.log('savedCrJV', savedCrJV)
        console.log('savedDrJV', savedDrJV)


        res.status(201).json({
            message: 'Voucher and Receipt saved successfully',
            voucher: savedVoucher,
            CrJV: savedCrJV,
            DrJV: savedDrJV
        });
    } catch (err) {
        console.error('Error creating Journal Voucher:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update Journal Voucher by soceityId
const updateJVBySociety = async (req, res) => {
  try {
    const { societyId, journalvoucherID } = req.params;
     // 1. ID Validation ✅
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(journalvoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await JournalVoucher.findOneAndUpdate(
      { _id: journalvoucherID, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "journal voucher  not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//// Delete a Journal Voucher by soceityId
const deleteJVBySociety = async (req, res) => {
  try {
    const { societyId, journalvoucherID } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(journalvoucherID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedjournalvoucher = await JournalVoucher.findOneAndDelete(
      { _id: journalvoucherID, societyId: societyId }
    );

    if (!deletedjournalvoucher) {
      return res.status(404).json({ error: 'Journal Voucher not found in this society' });
    }

    res.status(200).json({ message: 'Journal Voucher deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new Journal Voucher
// const createJournalVoucher = async (req, res) => {
//     console.log(req.body)
//     try {
//         const {
//             date,
//             debitLedger,
//             creditLedger,
//             debitAmount,
//             creditAmount,
//             narration
//         } = req.body;

//         // Basic validation (can be extended)
//         if (!date) {
//             return res.status(400).json({ error: 'Date is required.' });
//         }

//         const newVoucher = new JournalVoucher({
//             date,
//             debitLedger,
//             creditLedger,
//             debitAmount,
//             creditAmount,
//             narration
//         });

//         const savedVoucher = await newVoucher.save();
//         console.log("savedVoucher", savedVoucher)
//         //   res.status(201).json(savedVoucher);
//         const CrJV = new Voucher({
//             voucherId: savedVoucher._id,
//             CrAmount: savedVoucher.creditAmount,
//             LedgerId: savedVoucher.creditLedger,
//             VoucherNumber: savedVoucher.JournalVoucherNumber,
//             VoucherType: 'JV',
//             EntryType: 'Credit'
//         });

//         const DrJV = new Voucher({
//             voucherId: savedVoucher._id,
//             DrAmount: savedVoucher.debitAmount,
//             LedgerId: savedVoucher.debitLedger,
//             VoucherNumber: savedVoucher.JournalVoucherNumber,
//             VoucherType: 'JV',
//             EntryType: 'Debit'
//         });
//         const savedCrJV = await CrJV.save();
//         const savedDrJV = await DrJV.save();
//         console.log('savedCrJV', savedCrJV)
//         console.log('savedDrJV', savedDrJV)
//         // Populate Account details
//         //   const populatedCrJV = await Voucher.findById(savedCrJV._id)
//         //       .populate({
//         //         path: "_id",
//         //         select: "accountName drOrCr"
//         //       });

//         //     const populatedDrJV = await Voucher.findById(savedDrJV._id)
//         //       .populate({
//         //         path: "_id",
//         //         select: "accountName drOrCr"
//         //       });


//         res.status(201).json({
//             message: 'Voucher and Receipt saved successfully',
//             voucher: savedVoucher,
//             CrJV: savedCrJV,
//             DrJV: savedDrJV
//         });
//     } catch (err) {
//         console.error('Error creating Journal Voucher:', err);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// Get a Journal Voucher by ID
// const getJournalVoucherById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const journalVoucher = await JournalVoucher.findById(id);

//         if (!journalVoucher) {
//             return res.status(404).json({ message: 'Journal voucher not found.' });
//         }

//         res.status(200).json(journalVoucher);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching journal voucher.', error: error.message });
//     }
// };

// // Update a Journal Voucher by ID
// const updateJournalVoucher = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { voucherNumber, date, debitLedger, creditLedger, debitAmount, creditAmount, narration } = req.body;

//         const updatedJournalVoucher = await JournalVoucher.findByIdAndUpdate(
//             id,
//             { voucherNumber, date, debitLedger, creditLedger, debitAmount, creditAmount, narration },
//             { new: true } // Return the updated document
//         );

//         if (!updatedJournalVoucher) {
//             return res.status(404).json({ message: 'Journal voucher not found.' });
//         }

//         res.status(200).json(updatedJournalVoucher);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating journal voucher.', error: error.message });
//     }
// };

// // Delete a Journal Voucher by ID
// const deleteJournalVoucher = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedJournalVoucher = await JournalVoucher.findByIdAndDelete(id);

//         if (!deletedJournalVoucher) {
//             return res.status(404).json({ message: 'Journal voucher not found.' });
//         }

//         res.status(200).json({ message: 'Journal voucher deleted successfully.' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting journal voucher.', error: error.message });
//     }
// };

module.exports = {
    getJVBySocietyId,
    createJVBysoceityId,
    updateJVBySociety,
    deleteJVBySociety,
    getAllJournalVouchers,
    // createJournalVoucher,
    // getJournalVoucherById,
    // updateJournalVoucher,
    // deleteJVBySociety,
};