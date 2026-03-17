const express = require('express')
const router = express.Router()
const { getFinancialYears,createFinancialYear, } = require('../controllers/FinancialYearController')


router.get('/', getFinancialYears)

router.post('/', createFinancialYear)

module.exports = router