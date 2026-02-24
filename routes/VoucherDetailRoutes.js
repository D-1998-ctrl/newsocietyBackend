const express = require('express');
const router = express.Router();
const {
    createVoucherDetail,
    getAllVoucherDetails,
    getVoucherDetailById,
    updateVoucherDetail,
    deleteVoucherDetail,
} = require('../controllers/VoucherDetailController');

router.post('/', createVoucherDetail);
router.get('/', getAllVoucherDetails);
router.get('/:id', getVoucherDetailById);
router.patch('/:id', updateVoucherDetail);
router.delete('/:id', deleteVoucherDetail);

module.exports = router;
