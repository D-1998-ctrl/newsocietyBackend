const mongoose = require('mongoose');
const Group = require('../models/AccountGroupModel');


const createAccountGroup = async (req, res) => {
  try {
    const accountGroup = new Group(req.body);
    await accountGroup.save();
    res.status(201).json(accountGroup);
    
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create account group.' });
  }
};

const getAllAccountGroups = async (req, res) => {
  try {
    const accountGroups = await Group.find();
    res.status(200).json(accountGroups);
   
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch account groups.' });
  }
};

const getAccountGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const accountGroup = await Group.findById(id);
    if (!accountGroup) {
      return res.status(404).json({ error: 'Account group not found' });
    }
    res.status(200).json(accountGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAccountGroup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updatedGroup = await Group.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedGroup) {
      return res.status(404).json({ error: 'Account group not found' });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAccountGroup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deletedGroup = await Group.findByIdAndDelete(id);

    if (!deletedGroup) {
      return res.status(404).json({ error: 'Account group not found' });
    }

    res.status(200).json({ message: 'Account group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAccountGroup,
  getAllAccountGroups,
  getAccountGroupById,
  updateAccountGroup,
  deleteAccountGroup,
};

