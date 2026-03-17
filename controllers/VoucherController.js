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


// Get all Vouchers by date for trial bal sheet

// const getAllVouchersByDate = async (req, res) => {
//   try {

//     const { fromDate, toDate } = req.query;

//     if (!fromDate || !toDate) {
//       return res.status(400).json({ message: "FromDate and ToDate required" });
//     }

//     const vouchers = await Voucher.find({
//       createdAt: {
//         $gte: new Date(fromDate),
//         $lte: new Date(toDate)
//       }
//     }).populate("LedgerId");

//     const ledgerSummary = {};

//     vouchers.forEach((voucher) => {

//       if (!voucher.LedgerId) return;

//       const ledger = voucher.LedgerId;
//       const ledgerId = ledger._id.toString();

//       if (!ledgerSummary[ledgerId]) {

//         ledgerSummary[ledgerId] = {
//           ledgerId: ledgerId,
//           ledgerName: ledger.accountName,
//           opening: Number(ledger.opening || 0),
//           TotalDrAmount: 0,
//           TotalCrAmount: 0,
//           closingBalance: 0,
//           vouchers: []
//         };
//       }

//       ledgerSummary[ledgerId].TotalDrAmount += Number(voucher.DrAmount || 0);
//       ledgerSummary[ledgerId].TotalCrAmount += Number(voucher.CrAmount || 0);

//       // store voucher details
//       ledgerSummary[ledgerId].vouchers.push({
//         VoucherType: voucher.VoucherType,
//         EntryType: voucher.EntryType,
//         VoucherNumber: voucher.VoucherNumber,
//         DrAmount: voucher.DrAmount,
//         CrAmount: voucher.CrAmount
//       });

//     });

//     const finalData = Object.values(ledgerSummary).map((ledger) => {

//       const closingBalance =
//         ledger.opening + ledger.TotalDrAmount - ledger.TotalCrAmount;

//       return {
//         ...ledger,
//         closingBalance
//       };

//     });

//     res.json(finalData);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
const getAllVouchersByDate = async (req, res) => {
  try {

    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "FromDate and ToDate required" });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // IMPORTANT
    endDate.setHours(23, 59, 59, 999);

    const vouchers = await Voucher.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("LedgerId");

   const ledgerSummary = {};

    vouchers.forEach((voucher) => {

      if (!voucher.LedgerId) return;

      const ledger = voucher.LedgerId;
      const ledgerId = ledger._id.toString();

      if (!ledgerSummary[ledgerId]) {

        ledgerSummary[ledgerId] = {
          ledgerId: ledgerId,
          ledgerName: ledger.accountName,
          opening: Number(ledger.opening || 0),
          TotalDrAmount: 0,
          TotalCrAmount: 0,
          closingBalance: 0,
          vouchers: []
        };
      }

      ledgerSummary[ledgerId].TotalDrAmount += Number(voucher.DrAmount || 0);
      ledgerSummary[ledgerId].TotalCrAmount += Number(voucher.CrAmount || 0);

      // store voucher details
      ledgerSummary[ledgerId].vouchers.push({
        VoucherType: voucher.VoucherType,
        EntryType: voucher.EntryType,
        VoucherNumber: voucher.VoucherNumber,
        DrAmount: voucher.DrAmount,
        CrAmount: voucher.CrAmount
      });

    });

    const finalData = Object.values(ledgerSummary).map((ledger) => {

      const closingBalance =
        ledger.opening + ledger.TotalDrAmount - ledger.TotalCrAmount;

      return {
        ...ledger,
        closingBalance
      };

    });

    res.json(finalData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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
    let { fromdate, todate } = req.query;

    console.log('Received params:', { ledgerId, fromdate, todate }); // Debug log

    // Build the base query
    let query = { LedgerId: ledgerId };

    // Handle date filtering
    if (fromdate || todate) {
      query.createdAt = {};

      if (fromdate) {
        const from = new Date(fromdate);
        if (isNaN(from.getTime())) {
          return res.status(400).json({ message: 'Invalid fromdate format. Use YYYY-MM-DD.' });
        }
        from.setUTCHours(0, 0, 0, 0); // Use UTC to avoid timezone shifts
        query.createdAt.$gte = from;
      }

      if (todate) {
        const to = new Date(todate);
        if (isNaN(to.getTime())) {
          return res.status(400).json({ message: 'Invalid todate format. Use YYYY-MM-DD.' });
        }
        to.setUTCHours(23, 59, 59, 999);
        query.createdAt.$lte = to;
      }
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2)); // Debug log

    const vouchers = await Voucher.find(query)
      .populate({
        path: 'LedgerId',
        model: 'Account',
      });

    if (!vouchers || vouchers.length === 0) {
      return res.status(404).json({ message: 'No vouchers found for this LedgerId with the given filters' });
    }

    res.status(200).json(vouchers);
  } catch (error) {
    console.error('Error:', error); // Debug log
    res.status(500).json({ message: 'Error fetching vouchers by LedgerId', error: error.message });
  }
};

//http://localhost:8001/Voucher/ledger/68469ddb0bca2b2225f02295?fromdate=2025-06-01&todate=2025-06-30 this format //
// const getVouchersByLedgerId = async (req, res) => {
//   try {
//     let { ledgerId, fromdate, todate } = req.query;

//     console.log('Received query:', { ledgerId, fromdate, todate });

//     if (!ledgerId) {
//       return res.status(400).json({ message: 'ledgerId is required' });
//     }

//     // Base query
//     let query = { LedgerId: ledgerId };

//     // Date filtering
//     if (fromdate || todate) {
//       query.createdAt = {};

//       if (fromdate) {
//         const from = new Date(fromdate);
//         if (isNaN(from.getTime())) {
//           return res.status(400).json({ message: 'Invalid fromdate format. Use YYYY-MM-DD.' });
//         }
//         from.setUTCHours(0, 0, 0, 0);
//         query.createdAt.$gte = from;
//       }

//       if (todate) {
//         const to = new Date(todate);
//         if (isNaN(to.getTime())) {
//           return res.status(400).json({ message: 'Invalid todate format. Use YYYY-MM-DD.' });
//         }
//         to.setUTCHours(23, 59, 59, 999);
//         query.createdAt.$lte = to;
//       }
//     }

//     console.log('MongoDB query:', query);

//     const vouchers = await Voucher.find(query).populate({
//       path: 'LedgerId',
//       model: 'Account',
//     });

//     if (!vouchers.length) {
//       return res.status(404).json({
//         message: 'No vouchers found for this LedgerId with given filters',
//       });
//     }

//     res.status(200).json(vouchers);

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       message: 'Error fetching vouchers',
//       error: error.message,
//     });
//   }
// };


//http://localhost:8001/Voucher/ledger?fromdate=2025-06-01&todate=2025-06-30&ledgerId=68469ddb0bca2b2225f02295 this format 
// const getVouchersByLedgerId = async (req, res) => {
//   try {
//     const { ledgerId } = req.params;
//     let { fromdate, todate } = req.query;

//     console.log('Received params:', { ledgerId, fromdate, todate }); // Debug log

//     // Build the base query
//     let query = { LedgerId: ledgerId };

//     // Handle date filtering
//     if (fromdate || todate) {
//       query.createdAt = {};

//       if (fromdate) {
//         const from = new Date(fromdate);
//         if (isNaN(from.getTime())) {
//           return res.status(400).json({ message: 'Invalid fromdate format. Use YYYY-MM-DD.' });
//         }
//         from.setUTCHours(0, 0, 0, 0); // Use UTC to avoid timezone shifts
//         query.createdAt.$gte = from;
//       }

//       if (todate) {
//         const to = new Date(todate);
//         if (isNaN(to.getTime())) {
//           return res.status(400).json({ message: 'Invalid todate format. Use YYYY-MM-DD.' });
//         }
//         to.setUTCHours(23, 59, 59, 999);
//         query.createdAt.$lte = to;
//       }
//     }

//     console.log('MongoDB query:', JSON.stringify(query, null, 2)); // Debug log

//     const vouchers = await Voucher.find(query)
//       .populate({
//         path: 'LedgerId',
//         model: 'Account',
//       });

//     if (!vouchers || vouchers.length === 0) {
//       return res.status(404).json({ message: 'No vouchers found for this LedgerId with the given filters' });
//     }

//     res.status(200).json(vouchers);
//   } catch (error) {
//     console.error('Error:', error); // Debug log
//     res.status(500).json({ message: 'Error fetching vouchers by LedgerId', error: error.message });
//   }

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
  getAllVouchersByDate,
  updateVoucher,
  deleteVoucher,
  groupByLedgerId

};
