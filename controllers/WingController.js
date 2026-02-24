const Wing = require("../models/WingModel");

// Create a new wing
const createWing = async (req, res) => {
  try {
    const{ name, totalUnits, unitTypes,totalParkings,parkingType,numberOfFloors } = req.body;
    const wing = new Wing({ name, totalUnits, unitTypes,totalParkings,parkingType,numberOfFloors });

    console.log(wing)
    await wing.save();
    res.status(201).json(wing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const createUnitType = async (req, res) => {
  try {
    const { name, area, propertyType } = req.body;
    const newUnitType = new UnitType({ name, area, propertyType });

    await newUnitType.save();
    res.status(201).json(newUnitType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all wings
// const getWings = async (req, res) => {
//   try {
//     const wings = await Wing.find();
//     res.status(200).json(wings);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getWings = async (req, res) => {
  try {
    const wings = await Wing.find().populate("unitTypes", "propertyType");
    res.status(200).json(wings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get a single wing by ID
const getWingById = async (req, res) => {
  try {
    const wing = await Wing.findById(req.params.id);
    if (!wing) {
      return res.status(404).json({ message: "Wing not found" });
    }
    res.status(200).json(wing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a wing by ID
const updateWing = async (req, res) => {
  try {
    const wing = await Wing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!wing) {
      return res.status(404).json({ message: "Wing not found" });
    }
    res.status(200).json(wing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a wing by ID
const deleteWing = async (req, res) => {
  try {
    const wing = await Wing.findByIdAndDelete(req.params.id);
    if (!wing) {
      return res.status(404).json({ message: "Wing not found" });
    }
    res.status(200).json({ message: "Wing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createWing,
  getWings,
  getWingById,
  updateWing,
  deleteWing,
};
