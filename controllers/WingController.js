const Wing = require("../models/WingModel");
const mongoose = require('mongoose');


// Get all wings
const getWings = async (req, res) => {
  try {

    const wings = await Wing.find().populate("unitTypes", "propertyType");
    res.status(200).json(wings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 //Get wings by society ID
const getWingBySocietyID  = async (req, res) => {
  try {
    const { societyId } = req.params;
    const wings = await Wing.find({ societyId }).populate("unitTypes", "propertyType");
    res.status(200).json(wings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Create a new wing
const createWing = async (req, res) => {
  const { societyId } = req.params;
  try {
    
    const{ name, totalUnits, unitTypes,totalParkings,parkingType,numberOfFloors } = req.body;
    const wing = new Wing({ name, totalUnits, unitTypes,totalParkings,parkingType,numberOfFloors,societyId });

    console.log(wing)
    await wing.save();
    res.status(201).json(wing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Update a parking entry by society ID
const updateWing = async (req, res) => {
  try {
    const { societyId, wingID } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(wingID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await Wing.findOneAndUpdate(
      { _id: wingID, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "wing  not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//// Delete a parking by soceityId
const deleteWing = async (req, res) => {
  try {
    const { societyId, wingID } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(wingID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedWing = await Wing.findOneAndDelete(
      { _id: wingID, societyId: societyId }
    );

    if (!deletedWing) {
      return res.status(404).json({ error: 'Wing not found in this society' });
    }

    res.status(200).json({ message: 'Wing deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// // Get a single wing by ID
// const getWingById = async (req, res) => {
//   try {
//     const wing = await Wing.findById(req.params.id);
//     if (!wing) {
//       return res.status(404).json({ message: "Wing not found" });
//     }
//     res.status(200).json(wing);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update a wing by ID
// const updateWing = async (req, res) => {
//   try {
//     const wing = await Wing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!wing) {
//       return res.status(404).json({ message: "Wing not found" });
//     }
//     res.status(200).json(wing);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete a wing by ID
// const deleteWing = async (req, res) => {
//   try {
//     const wing = await Wing.findByIdAndDelete(req.params.id);
//     if (!wing) {
//       return res.status(404).json({ message: "Wing not found" });
//     }
//     res.status(200).json({ message: "Wing deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = {
  getWingBySocietyID,
  createWing,
  getWings,
  // getWingById,
  updateWing,
  deleteWing,
};
