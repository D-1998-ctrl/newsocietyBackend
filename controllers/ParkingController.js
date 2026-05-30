const Parking = require('../models/ParkingModel');
const mongoose = require('mongoose');


const getParkings = async (req, res) => {
  try {
    const parkings = await Parking.find();
    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 //Get parking by society ID
const getParkingBySocietyID = async (req, res) => {
  try {
    const { societyId } = req.params;
    const parkings = await Parking.find({ societyId });
    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a new parking entry by society ID
const createParking = async (req, res) => {
  const { societyId } = req.params;
  try {
    const  { parkingType, parkingArea,unit} =req.body;
    const NewParking = new Parking({ parkingType, parkingArea,unit ,societyId});


    await NewParking.save();
    res.status(201).json(NewParking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Update a parking entry by society ID
const updateParking = async (req, res) => {
  try {
    const { societyId, parkingID } = req.params;
     // 1. ID Validation ✅
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(parkingID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await Parking.findOneAndUpdate(
      { _id: parkingID, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Parking Entry  not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//// Delete a parking by soceityId
const deleteParking = async (req, res) => {
  try {
    const { societyId, parkingID } = req.params;


    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(parkingID)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }


    const deletedParkingEntry = await Parking.findOneAndDelete(
      { _id: parkingID, societyId: societyId }
    );

    if (!deletedParkingEntry) {
      return res.status(404).json({ error: 'Parking Entry not found in this society' });
    }

    res.status(200).json({ message: 'Parking Entry deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Create a new parking entry
// const createParking = async (req, res) => {
//   try {
//     const  { parkingType, parkingArea,unit} =req.body;
//     const NewParking = new Parking({ parkingType, parkingArea,unit });


//     await NewParking.save();
//     res.status(201).json(NewParking);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };




// Get all parking entries


// // Get a parking entry by ID
// const getParkingById = async (req, res) => {
//   try {
//     const parking = await Parking.findById(req.params.id);
//     if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
//     res.status(200).json(parking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update a parking entry by ID
// const updateParking = async (req, res) => {
//   try {
//     const parking = await Parking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
//     res.status(200).json(parking);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// Delete a parking entry by ID
// const deleteParking = async (req, res) => {
//   try {
//     const parking = await Parking.findByIdAndDelete(req.params.id);
//     if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
//     res.status(200).json({ message: 'Parking entry deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = {
  getParkingBySocietyID,
   createParking,
  getParkings,
  // getParkingById,
  updateParking,
  deleteParking
};
