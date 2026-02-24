const Voucher = require('../models/VoucherModel');

// Create a new Voucher
const createVoucher = async (req, res) => {
  try {
    const voucher = new Voucher(req.body);
    await voucher.save();
    res.status(201).json({ message: 'Voucher created successfully', voucher });
  } catch (error) {
    res.status(400).json({ message: 'Error creating voucher', error });
  }
};

// Get all Vouchers
const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().populate('LedgerId');
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vouchers', error });
  }
};

// Get a Voucher by ID
 const getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.status(200).json(voucher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching voucher', error });
  }
};



//get Vouchers By LedgerId
const getVouchersByLedgerId = async (req, res) => {
  try {
    const { ledgerId } = req.params;

    // const vouchers = await Voucher.find({ LedgerId: ledgerId });
 const vouchers = await Voucher.find({ LedgerId: ledgerId })
      .populate({
        path: 'LedgerId',
        model: 'Account',
       
      });
    if (!vouchers || vouchers.length === 0) {
      return res.status(404).json({ message: 'No vouchers found for this LedgerId' });
    }

    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vouchers by LedgerId', error });
  }
};

//filter by date
// const getVouchersByLedgerId = async (req, res) => {
//   try {
//     const { ledgerId } = req.params;
//     const { fromDate, toDate } = req.query;

//     // Build the query object
//     const query = { LedgerId: ledgerId };

//     // Add date filtering if provided
//     if (fromDate || toDate) {
//       query.createdAt = {};
//       if (fromDate) {
//         query.createdAt.$gte = new Date(fromDate);
//       }
//       if (toDate) {
//         query.createdAt.$lte = new Date(toDate);
//       }
//     }

//     const vouchers = await Voucher.find(query)
//       .populate({
//         path: 'LedgerId',
//         model: 'Account',
//       })
//       .sort({ createdAt: 1 }); // Optional: sort by date ascending

//     if (!vouchers || vouchers.length === 0) {
//       return res.status(404).json({ message: 'No vouchers found for this LedgerId' });
//     }

//     res.status(200).json(vouchers);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching vouchers by LedgerId', error });
//   }
// };


// Update a Voucher
const updateVoucher = async (req, res) => {
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.status(200).json({ message: 'Voucher updated successfully', updatedVoucher });
  } catch (error) {
    res.status(400).json({ message: 'Error updating voucher', error });
  }
};

// Delete a Voucher
const deleteVoucher = async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting voucher', error });
  }
};
const groupByLedgerId = (vouchers) => {
  return vouchers.reduce((acc, voucher) => {
    const ledgerId = voucher.LedgerId;
    if (!acc[ledgerId]) {
      acc[ledgerId] = [];
    }
    acc[ledgerId].push(voucher);
    return acc;
  }, {});
};


module.exports = {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  getVouchersByLedgerId,
  updateVoucher,
  deleteVoucher,
  groupByLedgerId
};
