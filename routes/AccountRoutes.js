const express = require('express');
const {

  getAccounts,
  getAccountsBySocietyId,
  createAccountsBysoceityId,
  updateAccountsBySociety,
  deleteAccountBySociety,
  getProfitAndLoss,
  getBalanceSheetLedgers,
  // createAccount,
  // getAccountById,
  // updateAccount,
  // searchGroupAccounts,
  // getAccountId,
  // getAccountByGroupCode
  // getAccountByAccountId
} = require('../controllers/LedgerController');


const router = express.Router();
router.get('/', getAccounts);
router.get('/society/:societyId', getAccountsBySocietyId);
router.post("/society/:societyId/", createAccountsBysoceityId);
router.put("/society/:societyId/ledgers/:ledgerId", updateAccountsBySociety);
router.delete("/society/:societyId/ledgers/:ledgerId", deleteAccountBySociety);
// router.get('/profit-loss/report/:societyId', getProfitAndLoss);
router.get('/reports/profit-loss/:societyId', getProfitAndLoss);
// router.get('/api/accounts/balance-sheet', getBalanceSheetLedgers);
router.get('/balance-sheet/:societyId', getBalanceSheetLedgers);
// router.get('/id', getAccountId);
// router.get('/search', searchGroupAccounts);
// router.get('/:id', getAccountById);
// router.get('/accounts/:accountId',getAccountByAccountId);
// router.patch('/:id', updateAccount);
// Routes for accounts
// router.post('/', createAccount);


module.exports = router;