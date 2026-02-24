const mongoose = require('mongoose');
const Group = require('../models/AccountSubGroupModel');

const createSubGroup = async (req, res) => {
  try {
    const subGroup = new Group(req.body);
    await subGroup.save();
    res.status(201).json(subGroup);
    
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create Subgroups.' });
  }
};

const getAllSubGroups = async (req, res) => {
  try {
    const subGroups = await Group.find();
    res.status(200).json(subGroups);
   
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch Subgroups.' });
  }
};

const getSubGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const subGroup = await Group.findById(id);
    if (!subGroup) {
      return res.status(404).json({ error: 'Subgroup not found' });
    }
    res.status(200).json(subGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubGroup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updatedsubGroup = await Group.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedsubGroup) {
      return res.status(404).json({ error: 'Subgroup not found' });
    }

    res.status(200).json(updatedsubGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSubGroup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deletedSubGroup = await Group.findByIdAndDelete(id);

    if (!deletedSubGroup) {
      return res.status(404).json({ error: 'Subgroup not found' });
    }

    res.status(200).json({ message: 'Subgroup deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSubGroup,
  getAllSubGroups,
  getSubGroupById,
  updateSubGroup,
  deleteSubGroup,
};

