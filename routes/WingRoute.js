const express = require("express");
const router = express.Router();
const {
  createWing,
  getWings,
  getWingById,
  updateWing,
  deleteWing,
} = require("../controllers/WingController");

// Define routes
router.post("/", createWing);
router.get("/", getWings);
router.get("/:id", getWingById);
router.patch("/:id", updateWing);
router.delete("/:id", deleteWing);

module.exports = router;
