const express = require('express');
const {
    createParking,
    getParkings,
    getParkingById,
    updateParking,
    deleteParking
} = require('../controllers/ParkingController');

const router = express.Router();

router.post('/', createParking);
router.get('/', getParkings);
router.get('/:id', getParkingById);
router.patch('/:id', updateParking);
router.delete('/:id', deleteParking);

module.exports = router;



