const Account = require('../models/LedgerModel');
const BoardMember = require('../models/BoardMembersModel');

// Create a new account
const createAccount = async (req, res) => {
  try {
    const account = new Account(req.body);
    
    console.log(account);
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all accounts with optional filtering by groupId
// const getAccounts = async (req, res) => {
//   try {
//     const { groupId, search, limit = 10 } = req.query;
//     let query = {};

//     if (groupId) {
//       query.groupId = groupId;
//     }

//     if (search && search.length >= 2) {
//       const searchRegex = new RegExp(search, 'i');
//       query.$or = [
//         { name: searchRegex },
//         { accountId: searchRegex },
//         { email: searchRegex },
//         { phone: searchRegex }
//       ];
//     }

//     const accounts = await Account.find(query)
//       .limit(parseInt(limit))
//       .sort({ name: 1 });

//     res.status(200).json(accounts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getAccounts = async (req, res) => {
  try {
    const { groupId, search } = req.query;
    let query = {};

    if (groupId) {
      query.groupId = groupId;
    }

    if (search && search.length >= 2) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { accountId: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    const accounts = await Account.find(query)
      .sort({ name: 1 }).populate({
        path: 'groupId',
        model: 'accountGroup', // Ensure this is the exact name used in mongoose.model('accountGroup', ...)
      });

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//
const getAccountId = async (req, res) => {
  try {
    const { search, limit = 10 } = req.query;
    const query = {};

    if (search && search.length >= 2) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { accountId: searchRegex }
      ];
    }

    const accounts = await Account.find(query)
      .select('_id') // Only include _id
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search accounts within a specific group (optimized for real-time suggestions)
const searchGroupAccounts = async (req, res) => {
  try {
    const { groupId, query, limit = 5 } = req.query;

    if (!groupId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const searchRegex = new RegExp(query, 'i');

    const accounts = await Account.find({
      groupId,
      $or: [
        { name: searchRegex },
        { accountId: searchRegex }
      ]
    })
      .limit(parseInt(limit))
      .select('name accountId email phone'); // Return only essential fields

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an account by ID
const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get account by accountId
const getAccountByAccountId = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findOne({ accountId });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an account by ID
const updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an account by ID
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//for Profit&Loss statement
// const getProfitAndLoss = async (req, res) => {
//   try {
//     const incomeGroupCodes = [19, 28, 39];
//     const expenseGroupCodes = [6, 13, 14, 15, 16, 27, 33, 34, 36, 37, 38, 40, 41, 43, 44, 45, 46, 47, 48];

//     // Fetch all ledgers with group info
//     const ledgers = await Account.find().populate({
//       path: 'groupId',
//       model: 'accountGroup'
//     });

//     // Filter ledgers based on income or expense group codes
//     const incomeLedgers = ledgers.filter(
//       ledger => ledger.groupId && incomeGroupCodes.includes(ledger.groupId.groupCode)
//     );

//     const expenseLedgers = ledgers.filter(
//       ledger => ledger.groupId && expenseGroupCodes.includes(ledger.groupId.groupCode)
//     );

//     // Fetch board members (select only name, position, address if needed)
//     const boardMembers = await BoardMember.find({}, 'name position address');

//     // Return combined data
//     res.json({
//       incomeLedgers,
//       expenseLedgers,
//       boardMembers
//     });
//   } catch (error) {
//     console.error("Error in fetching data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getProfitAndLoss = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query; // Get dates from query parameters
    const incomeGroupCodes = [19, 28, 39];
    const expenseGroupCodes = [6, 13, 14, 15, 16, 27, 33, 34, 36, 37, 38, 40, 41, 43, 44, 45, 46, 47, 48];

    // Build the date filter object if dates are provided
    const dateFilter = {};
    if (fromDate) {
      dateFilter.$gte = new Date(fromDate);
    }
    if (toDate) {
      dateFilter.$lte = new Date(toDate);
    }

    // Base query for ledgers
    const ledgerQuery = {};

    // Add date filter if dates are provided
    if (fromDate || toDate) {
      ledgerQuery.createdAt = dateFilter;
    }

    // Fetch all ledgers with group info, applying date filter if provided
    const ledgers = await Account.find(ledgerQuery).populate({
      path: 'groupId',
      model: 'accountGroup'
    });

    // Filter ledgers based on income or expense group codes
    const incomeLedgers = ledgers.filter(
      ledger => ledger.groupId && incomeGroupCodes.includes(ledger.groupId.groupCode)
    );

    const expenseLedgers = ledgers.filter(
      ledger => ledger.groupId && expenseGroupCodes.includes(ledger.groupId.groupCode)
    );

    // Fetch board members
    const boardMembers = await BoardMember.find({}, 'name position address');

    // Return combined data
    res.json({
      incomeLedgers,
      expenseLedgers,
      boardMembers,
      dateRange: {
        fromDate: fromDate || 'Not specified',
        toDate: toDate || 'Not specified'
      }
    });
  } catch (error) {
    console.error("Error in fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// for typecode B
// const getBalanceSheetLedgers = async (req, res) => {
//   try {
//     const assetGroupCodes = [1, 3, 5, 7, 10, 12, 17, 18, 20, 21, 30, 42];
//     const liabilityGroupCodes = [2, 4, 8, 11, 22, 29, 26, 9, 32, 53, 52];

//     // First get all balance sheet accounts with populated groups
//     const allAccounts = await Account.find({
//       typeCode: "Balance Sheet"
//     })
//     .populate({
//       path: 'groupId',
//       model: 'accountGroup'
//     });
   

//     // Then filter them based on group codes
//     const assetLedgers = allAccounts.filter(account => 
//       account.groupId && assetGroupCodes.includes(account.groupId.groupCode)
//     );

//     const liabilityLedgers = allAccounts.filter(account => 
//       account.groupId && liabilityGroupCodes.includes(account.groupId.groupCode)
//     );

//     const boardofMembers = await BoardMember.find();
    
//     res.json({
//       assets: assetLedgers,
//       liabilities: liabilityLedgers,
//       boardofMembers
//     });
//   } catch (error) {
//     console.error("Error in fetching Balance Sheet ledgers:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const getBalanceSheetLedgers = async (req, res) => {
  try {
    const assetGroupCodes = [1, 3, 5, 7, 10, 12, 17, 18, 20, 21, 30, 42];
    const liabilityGroupCodes = [2, 4, 8, 11, 22, 29, 26, 9, 32, 53, 52];

    // Get date filters from query parameters
    const { fromDate, toDate } = req.query;
    
    // Create the base query
    const baseQuery = {
      typeCode: "Balance Sheet"
    };

    // Add date filtering if dates are provided
    if (fromDate || toDate) {
      baseQuery.createdAt = {};
      if (fromDate) {
        baseQuery.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        baseQuery.createdAt.$lte = new Date(toDate);
      }
    }

    // First get all balance sheet accounts with populated groups
    const allAccounts = await Account.find(baseQuery)
      .populate({
        path: 'groupId',
        model: 'accountGroup'
      });

    // Then filter them based on group codes
    const assetLedgers = allAccounts.filter(account => 
      account.groupId && assetGroupCodes.includes(account.groupId.groupCode)
    );

    const liabilityLedgers = allAccounts.filter(account => 
      account.groupId && liabilityGroupCodes.includes(account.groupId.groupCode)
    );

    const boardofMembers = await BoardMember.find();
    
    res.json({
      assets: assetLedgers,
      liabilities: liabilityLedgers,
      boardofMembers
    });
  } catch (error) {
    console.error("Error in fetching Balance Sheet ledgers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  getAccountByAccountId,
  searchGroupAccounts, 
  getAccountId,
  getProfitAndLoss,
  getBalanceSheetLedgers
};