const UnitType = require('../models/UnitTypeModel');
const mongoose = require('mongoose');



// Get all UnitTypes
const getAllUnitTypes = async (req, res) => {
  try {
    const unitTypes = await UnitType.find();
    res.status(200).json(unitTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get UnitTypes by society ID
const getUnitTypesBySocietyID = async (req, res) => {
  try {
    const { societyId } = req.params;
    const unitTypes = await UnitType.find({ societyId });
    res.status(200).json(unitTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new UnitType
const createUnitType = async (req, res) => {
   const { societyId } = req.params;
  try {
    const { name, area, propertyType,unit } = req.body;
    const newUnitType = new UnitType({ name, area, propertyType,unit,societyId });

    await newUnitType.save();
    res.status(201).json(newUnitType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update a UnitType by society ID
const updateUnitType = async (req, res) => {
  try {
    const { societyId, unitID } = req.params;
     // 1. ID Validation ✅
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(unitID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await UnitType.findOneAndUpdate(
      { _id: unitID, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "UnitType  not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//// Delete UnitType by soceityId
const deleteUnitType = async (req, res) => {
  try {
    const { societyId, unitID } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(unitID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedunit = await UnitType.findOneAndDelete(
      { _id: unitID, societyId: societyId }
    );

    if (!deletedunit) {
      return res.status(404).json({ error: 'UnitType not found in this society' });
    }

    res.status(200).json({ message: 'UnitType deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// // Get a single UnitType by ID
// const getUnitTypeById = async (req, res) => {
//   try {
//     const unitType = await UnitType.findById(req.params.id);
//     if (!unitType) return res.status(404).json({ message: 'UnitType not found' });

//     res.status(200).json(unitType);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update a UnitType
// const updateUnitType = async (req, res) => {
//   try {
//     const updatedUnitType = await UnitType.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedUnitType) return res.status(404).json({ message: 'UnitType not found' });

//     res.status(200).json(updatedUnitType);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete a UnitType
// const deleteUnitType = async (req, res) => {
//   try {
//     const deletedUnitType = await UnitType.findByIdAndDelete(req.params.id);
//     if (!deletedUnitType) return res.status(404).json({ message: 'UnitType not found' });

//     res.status(200).json({ message: 'UnitType deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Export all CRUD functions
module.exports = {
  getUnitTypesBySocietyID,
  createUnitType,
  getAllUnitTypes,
  // getUnitTypeById,
  updateUnitType,
  deleteUnitType,
};
