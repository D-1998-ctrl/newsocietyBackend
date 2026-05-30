const express = require("express");
const router = express.Router();
const {
  getWingBySocietyID,
  createWing,
  getWings,
  // getWingById,
  updateWing,
  deleteWing,

} = require("../controllers/WingController");

// Define routes
router.get("/", getWings);
router.get('/society/:societyId', getWingBySocietyID);
router.post('/society/:societyId', createWing);
router.put("/society/:societyId/wing/:wingID", updateWing);
router.delete("/society/:societyId/wing/:wingID", deleteWing);
// router.get("/:id", getWingById);
// router.patch("/:id", updateWing);
// router.delete("/:id", deleteWing);

module.exports = router;
