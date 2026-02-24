const UnitType = require('../models/UnitTypeModel');

// Create a new UnitType
const createUnitType = async (req, res) => {
  try {
    const { name, area, propertyType,unit } = req.body;
    const newUnitType = new UnitType({ name, area, propertyType,unit });

    await newUnitType.save();
    res.status(201).json(newUnitType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all UnitTypes
const getAllUnitTypes = async (req, res) => {
  try {
    const unitTypes = await UnitType.find();
    res.status(200).json(unitTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single UnitType by ID
const getUnitTypeById = async (req, res) => {
  try {
    const unitType = await UnitType.findById(req.params.id);
    if (!unitType) return res.status(404).json({ message: 'UnitType not found' });

    res.status(200).json(unitType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a UnitType
const updateUnitType = async (req, res) => {
  try {
    const updatedUnitType = await UnitType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUnitType) return res.status(404).json({ message: 'UnitType not found' });

    res.status(200).json(updatedUnitType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a UnitType
const deleteUnitType = async (req, res) => {
  try {
    const deletedUnitType = await UnitType.findByIdAndDelete(req.params.id);
    if (!deletedUnitType) return res.status(404).json({ message: 'UnitType not found' });

    res.status(200).json({ message: 'UnitType deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all CRUD functions
module.exports = {
  createUnitType,
  getAllUnitTypes,
  getUnitTypeById,
  updateUnitType,
  deleteUnitType,
};
