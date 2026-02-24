const JournalVoucher = require("../models/JournalVouchermodel")
// Create a new Journal Voucher

const createJournalVoucher = async (req, res) => {
console.log(req.body)
    try {
      const {
       
        date,
        debitLedger,
        creditLedger,
        debitAmount,
        creditAmount,
        narration
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
        narration
      });
  
      const savedVoucher = await newVoucher.save();
      res.status(201).json(savedVoucher);
    } catch (err) {
      console.error('Error creating Journal Voucher:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
// Get all Journal Vouchers
const getAllJournalVouchers = async (req, res) => {
    try {
        const journalVouchers = await JournalVoucher.find();
        res.status(200).json(journalVouchers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching journal vouchers.', error: error.message });
    }
};

// Get a Journal Voucher by ID
const getJournalVoucherById = async (req, res) => {
    try {
        const { id } = req.params;
        const journalVoucher = await JournalVoucher.findById(id);

        if (!journalVoucher) {
            return res.status(404).json({ message: 'Journal voucher not found.' });
        }

        res.status(200).json(journalVoucher);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching journal voucher.', error: error.message });
    }
};

// Update a Journal Voucher by ID
const updateJournalVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const { voucherNumber, date, debitLedger, creditLedger, debitAmount, creditAmount, narration } = req.body;

        const updatedJournalVoucher = await JournalVoucher.findByIdAndUpdate(
            id,
            { voucherNumber, date, debitLedger, creditLedger, debitAmount, creditAmount, narration },
            { new: true } // Return the updated document
        );

        if (!updatedJournalVoucher) {
            return res.status(404).json({ message: 'Journal voucher not found.' });
        }

        res.status(200).json(updatedJournalVoucher);
    } catch (error) {
        res.status(500).json({ message: 'Error updating journal voucher.', error: error.message });
    }
};

// Delete a Journal Voucher by ID
const deleteJournalVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJournalVoucher = await JournalVoucher.findByIdAndDelete(id);

        if (!deletedJournalVoucher) {
            return res.status(404).json({ message: 'Journal voucher not found.' });
        }

        res.status(200).json({ message: 'Journal voucher deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting journal voucher.', error: error.message });
    }
};

module.exports = {
    createJournalVoucher,
    getAllJournalVouchers,
    getJournalVoucherById,
    updateJournalVoucher,
    deleteJournalVoucher,
};