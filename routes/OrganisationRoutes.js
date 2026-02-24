const express = require("express");
const router = express.Router();
const OrganisationControllers = require("../controllers/OrganisationControllers");

// Create a new society
router.post("/", OrganisationControllers.createSociety);

// Get all societies
router.get("/", OrganisationControllers.getAllSocieties);

// Get a single society by ID
router.get("/:id", OrganisationControllers.getSocietyById);

// Update a society by ID (Using PATCH)
router.patch("/:id", OrganisationControllers.updateSociety);

// Delete a society by ID
router.delete("/:id", OrganisationControllers.deleteSociety);

module.exports = router;
