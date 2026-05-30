const express = require('express');
const {
    getParkingBySocietyID,
    createParking,
    getParkings,
    // getParkingById,
    updateParking,
    deleteParking
} = require('../controllers/ParkingController');

const router = express.Router();
router.get('/', getParkings);
router.get('/society/:societyId', getParkingBySocietyID);
router.post('/society/:societyId', createParking);
router.put("/society/:societyId/parking/:parkingID", updateParking);
router.delete("/society/:societyId/parking/:parkingID",deleteParking);

// router.post('/', createParking);
// router.get('/:id', getParkingById);
// router.patch('/:id', updateParking);
// router.delete('/:id', deleteParking);

module.exports = router;



