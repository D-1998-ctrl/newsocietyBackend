const BoardMember = require('../models/BoardMembersModel');


// Get all Board Members
const getAllBoardMembers = async (req, res) => {
  try {
    const boardMembers = await BoardMember.find();
    res.status(200).json(boardMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Board Member by ID
const getBoardMemberById = async (req, res) => {
  try {
    const boardMember = await BoardMember.findById(req.params.id);
    if (!boardMember) {
      return res.status(404).json({ message: 'Board Member not found' });
    }
    res.status(200).json(boardMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new board member
const createBoardMember = async (req, res) => {
  try {
    const newBoardMember = new BoardMember(req.body);
    await newBoardMember.save();
    res.status(201).json(newBoardMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a Board Member
const updateBoardMember = async (req, res) => {
  try {
    const boardMember = await BoardMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!boardMember) {
      return res.status(404).json({ message: 'Board Member not found' });
    }
    res.status(200).json(boardMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Board Member
const deleteBoardMember = async (req, res) => {
  try {
    const boardMember = await BoardMember.findByIdAndDelete(req.params.id);
    if (!boardMember) {
      return res.status(404).json({ message: 'Board Member not found' });
    }
    res.status(200).json({ message: 'Board Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all functions
module.exports = {
  createBoardMember,
  getAllBoardMembers,
  getBoardMemberById,
  updateBoardMember,
  deleteBoardMember,
};

