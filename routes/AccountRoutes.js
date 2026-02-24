const express = require('express');
const  {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  searchGroupAccounts,
  getAccountId,

  getProfitAndLoss,
  getBalanceSheetLedgers,

  getAccountByGroupCode

  // getAccountByAccountId
  } = require('../controllers/LedgerController');


  const router = express.Router();

// Routes for accounts
router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/id', getAccountId);

router.get('/search', searchGroupAccounts);
router.get('/:id', getAccountById);
// router.get('/accounts/:accountId',getAccountByAccountId);
router.patch('/:id', updateAccount);
router.delete('/:id', deleteAccount);



router.get('/profit-loss/report', getProfitAndLoss);
router.get('/api/accounts/balance-sheet', getBalanceSheetLedgers);



module.exports = router;