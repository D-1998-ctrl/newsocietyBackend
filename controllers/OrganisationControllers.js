const Society = require("../models/OrganisationModels");
const mongoose = require("mongoose");


// Create a new society
exports.createSociety = async (req, res) => {
  try {
    const newSociety = new Society(req.body);
    const savedSociety = await newSociety.save();
    res.status(201).json(savedSociety);
  } catch (error) {
    res.status(500).json({ message: "Error creating society", error });
  }
};

// Get all societies
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching societies", error });
  }
};

// Get a single society by ID
exports.getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }
    res.status(200).json(society);
  } catch (error) {
    res.status(500).json({ message: "Error fetching society", error });
  }
};

exports.updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Society ID" });

    const updatedSociety = await Society.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedSociety) return res.status(404).json({ message: "Society not found" });

    res.status(200).json({ message: "Society updated successfully", data: updatedSociety });
  } catch (error) {
    res.status(500).json({ message: "Error updating society", error: error.message });
  }
};

// Delete a society by ID
exports.deleteSociety = async (req, res) => {
  try {
    const deletedSociety = await Society.findByIdAndDelete(req.params.id);
    if (!deletedSociety) {
      return res.status(404).json({ message: "Society not found" });
    }
    res.status(200).json({ message: "Society deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting society", error });
  }
};
