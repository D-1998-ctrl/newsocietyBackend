const mongoose = require('mongoose');
const AuditTempModel = require('../models/AuditTempModel');


const createAuditTemp = async (req, res) => {
  try {
    const newTemplate = new AuditTempModel(req.body);
    const savedTemplate = await newTemplate.save();

    res.status(201).json({
      message: "Audit Temp created",
      data: savedTemplate,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const getAllAuditTemp = async (req, res) => {
  try {
    const templates = await AuditTempModel.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAuditTempById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

     const template = await AuditTempModel.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'template group not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAuditTemp= async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

      const updated = await AuditTempModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'AuditTemp not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAuditTemp = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

     const deletetemp = await AuditTempModel.findByIdAndDelete(req.params.id);

    if (!deletetemp) {
      return res.status(404).json({ error: 'AuditTemp not found' });
    }

    res.status(200).json({ message: 'AuditTemp deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAuditTemp,
  getAllAuditTemp,
  getAuditTempById,
  updateAuditTemp,
  deleteAuditTemp,
};