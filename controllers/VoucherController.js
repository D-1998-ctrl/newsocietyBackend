const Voucher = require('../models/VoucherModel');
const mongoose = require('mongoose');


// Get all Vouchers
const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().populate('LedgerId');
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vouchers', error });
  }
};

// Get Vouchers by society ID
const getVouchersBySocietyId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const vouchers = await Voucher.find({ societyId }).populate('LedgerId');

    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create Vouchers by soceity Id
const createVouchersBysoceityId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const vouchers = await Voucher.create({
      ...req.body,
      societyId,
    });

    res.status(201).json(vouchers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a Voucher by ID
const getVoucherById = async (req, res) => {
  try {
    const { id, societyId } = req.params;

    const voucher = await Voucher.findOne({
      _id: id,
      societyId: societyId
    });

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
    const { ledgerId, societyId } = req.params;

    // Build the base query
    let query = {
      LedgerId: ledgerId,
      societyId: societyId
    };

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

//update Vouchers BySociety
const updateVouchersBySociety = async (req, res) => {
  try {
    const { societyId, voucherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(societyId) ||
      !mongoose.Types.ObjectId.isValid(voucherId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await Voucher.findOneAndUpdate(
      { _id: voucherId, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "voucher not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete Vouchers BySociety
const deleteVouchersBySociety = async (req, res) => {
  try {
    const { societyId, voucherId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
      !mongoose.Types.ObjectId.isValid(voucherId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedvoucher = await Voucher.findOneAndDelete(
      { _id: voucherId, societyId: societyId }
    );

    if (!deletedvoucher) {
      return res.status(404).json({ error: 'voucher not found in this society' });
    }

    res.status(200).json({ message: 'voucher deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///trial bal
const getBalancesheetByDate = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const { societyId } = req.params;

    const assetGroupCodes = [1, 3, 5, 7, 10, 12, 17, 18, 20, 21, 30, 42];
    const liabilityGroupCodes = [2, 4, 8, 11, 22, 29, 26, 9, 32, 53, 52];

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "FromDate and ToDate required" });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    // 🔥 Add societyId + date filter
    const vouchers = await Voucher.find({
      ...(societyId && { societyId }),
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate({
      path: "LedgerId",
      populate: {
        path: "groupId", // IMPORTANT for groupCode
        model: "accountGroup"
      }
    });

    const ledgerSummary = {};

    vouchers.forEach((voucher) => {
      if (!voucher.LedgerId) return;

      const ledger = voucher.LedgerId;
      const ledgerId = ledger._id.toString();

      if (!ledgerSummary[ledgerId]) {
        ledgerSummary[ledgerId] = {
          ledgerId: ledgerId,
          ledgerName: ledger.accountName,
          groupCode: ledger.groupId?.groupCode,
          opening: Number(ledger.opening || 0),
          TotalDrAmount: 0,
          TotalCrAmount: 0,
          closingBalance: 0,
          vouchers: []
        };
      }

      ledgerSummary[ledgerId].TotalDrAmount += Number(voucher.DrAmount || 0);
      ledgerSummary[ledgerId].TotalCrAmount += Number(voucher.CrAmount || 0);

      ledgerSummary[ledgerId].vouchers.push({
        VoucherType: voucher.VoucherType,
        EntryType: voucher.EntryType,
        VoucherNumber: voucher.VoucherNumber,
        DrAmount: voucher.DrAmount,
        CrAmount: voucher.CrAmount
      });
    });

    // 🔥 Convert to array + calculate closing
    const finalData = Object.values(ledgerSummary).map((ledger) => {
      const closingBalance =
        ledger.opening + ledger.TotalDrAmount - ledger.TotalCrAmount;

      return {
        ...ledger,
        closingBalance
      };
    });

    // 🔥 Separate Assets & Liabilities
    const assets = finalData.filter((ledger) =>
      assetGroupCodes.includes(ledger.groupCode)
    );

    const liabilities = finalData.filter((ledger) =>
      liabilityGroupCodes.includes(ledger.groupCode)
    );

    res.json({
      assets,
      liabilities
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//without soceityId
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






// // const groupByLedgerId = (vouchers) => {
// //   return vouchers.reduce((acc, voucher) => {
// //     const ledgerId = voucher.LedgerId;
// //     if (!acc[ledgerId]) {
// //       acc[ledgerId] = [];
// //     }
// //     acc[ledgerId].push(voucher);
// //     return acc;
// //   }, {});
// // };

// // Create a new Voucher
// // const createVoucher = async (req, res) => {
// //   try {
// //     const voucher = new Voucher(req.body);
// //     await voucher.save();
// //     res.status(201).json({ message: 'Voucher created successfully', voucher });
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error creating voucher', error });
// //   }
// // };

// // Get all Vouchers by date for trial bal sheet
// const getAllVouchersByDate = async (req, res) => {
//   try {

//     const { fromDate, toDate } = req.query;

//     if (!fromDate || !toDate) {
//       return res.status(400).json({ message: "FromDate and ToDate required" });
//     }

//     const startDate = new Date(fromDate);
//     const endDate = new Date(toDate);

//     // IMPORTANT
//     endDate.setHours(23, 59, 59, 999);

//     const vouchers = await Voucher.find({
//       createdAt: {
//         $gte: startDate,
//         $lte: endDate
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

// // Get a Voucher by ID
// // const getVoucherById = async (req, res) => {
// //   try {
// //     const voucher = await Voucher.findById(req.params.id);
// //     if (!voucher) {
// //       return res.status(404).json({ message: 'Voucher not found' });
// //     }
// //     res.status(200).json(voucher);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching voucher', error });
// //   }
// // };


// //get Vouchers By LedgerId

// //get Vouchers By LedgerId
// // const getVouchersByLedgerId = async (req, res) => {
// //   try {
// //     const { ledgerId } = req.params;
// //     let { fromdate, todate } = req.query;

// //     console.log('Received params:', { ledgerId, fromdate, todate }); // Debug log

// //     // Build the base query
// //     let query = { LedgerId: ledgerId };

// //     // Handle date filtering
// //     if (fromdate || todate) {
// //       query.createdAt = {};

// //       if (fromdate) {
// //         const from = new Date(fromdate);
// //         if (isNaN(from.getTime())) {
// //           return res.status(400).json({ message: 'Invalid fromdate format. Use YYYY-MM-DD.' });
// //         }
// //         from.setUTCHours(0, 0, 0, 0); // Use UTC to avoid timezone shifts
// //         query.createdAt.$gte = from;
// //       }

// //       if (todate) {
// //         const to = new Date(todate);
// //         if (isNaN(to.getTime())) {
// //           return res.status(400).json({ message: 'Invalid todate format. Use YYYY-MM-DD.' });
// //         }
// //         to.setUTCHours(23, 59, 59, 999);
// //         query.createdAt.$lte = to;
// //       }
// //     }

// //     console.log('MongoDB query:', JSON.stringify(query, null, 2)); // Debug log

// //     const vouchers = await Voucher.find(query)
// //       .populate({
// //         path: 'LedgerId',
// //         model: 'Account',
// //       });

// //     if (!vouchers || vouchers.length === 0) {
// //       return res.status(404).json({ message: 'No vouchers found for this LedgerId with the given filters' });
// //     }

// //     res.status(200).json(vouchers);
// //   } catch (error) {
// //     console.error('Error:', error); // Debug log
// //     res.status(500).json({ message: 'Error fetching vouchers by LedgerId', error: error.message });
// //   }
// // };

// // Update a Voucher
// const updateVoucher = async (req, res) => {
//   try {
//     const updatedVoucher = await Voucher.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedVoucher) {
//       return res.status(404).json({ message: 'Voucher not found' });
//     }
//     res.status(200).json({ message: 'Voucher updated successfully', updatedVoucher });
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating voucher', error });
//   }
// };

// // Delete a Voucher
// const deleteVoucher = async (req, res) => {
//   try {
//     const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
//     if (!deletedVoucher) {
//       return res.status(404).json({ message: 'Voucher not found' });
//     }
//     res.status(200).json({ message: 'Voucher deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting voucher', error });
//   }
// };

module.exports = {
  getAllVouchers,
  getVouchersBySocietyId,
  createVouchersBysoceityId,
  getVoucherById,
  getVouchersByLedgerId,
  updateVouchersBySociety,
  deleteVouchersBySociety,
  getAllVouchersByDate,
  getBalancesheetByDate
  // createVoucher,
  // getAllVouchersByDate,
  // updateVoucher,
  // deleteVoucher,
  // groupByLedgerId
};
