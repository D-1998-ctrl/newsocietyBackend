const express = require('express');
const {
  getUnitTypesBySocietyID,
  createUnitType,
  getAllUnitTypes,
  // getUnitTypeById,
  updateUnitType,
  deleteUnitType,
} = require('../controllers/UnitTypeController');

const router = express.Router();
router.get('/society/:societyId', getUnitTypesBySocietyID);
router.post('/society/:societyId', createUnitType);
router.get('/', getAllUnitTypes);
// router.get('/:id', getUnitTypeById);
// router.patch('/:id', updateUnitType);

router.put("/society/:societyId/unit/:unitID", updateUnitType);
router.delete("/society/:societyId/unit/:unitID", deleteUnitType);
// router.delete('/:id', deleteUnitType);

module.exports = router;
