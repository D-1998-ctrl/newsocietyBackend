const Parking = require('../models/ParkingModel');

// Create a new parking entry
const createParking = async (req, res) => {
  try {
    const  { parkingType, parkingArea,unit} =req.body;
    const NewParking = new Parking({ parkingType, parkingArea,unit });


    await NewParking.save();
    res.status(201).json(NewParking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// Get all parking entries
const getParkings = async (req, res) => {
  try {
    const parkings = await Parking.find();
    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a parking entry by ID
const getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
    res.status(200).json(parking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a parking entry by ID
const updateParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
    res.status(200).json(parking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a parking entry by ID
const deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);
    if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
    res.status(200).json({ message: 'Parking entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createParking,
  getParkings,
  getParkingById,
  updateParking,
  deleteParking
};
