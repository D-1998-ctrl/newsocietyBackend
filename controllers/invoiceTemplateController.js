const InvoiceTemplate = require('../models/InvoiceTemplate');
const Service = require('../models/ServiceModels');
const { validationResult } = require('express-validator');

// @desc    Get all invoice templates
// @route   GET /api/invoice-templates
// @access  Public
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await InvoiceTemplate.find()
      .populate('items.serviceId', 'name description factor reference')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Get single invoice template
// @route   GET /api/invoice-templates/:id
// @access  Public
exports.getTemplateById = async (req, res) => {
  try {
    const template = await InvoiceTemplate.findById(req.params.id)
      .populate('items.serviceId', 'name description factor reference');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Invoice template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invoice template not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Create new invoice template
// @route   POST /api/invoice-templates
// @access  Private/Admin
exports.createTemplate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, description, items, isActive, design } = req.body;

    // Validate all services exist
    for (const item of items) {
      const serviceExists = await Service.findById(item.serviceId);
      if (!serviceExists) {
        return res.status(400).json({
          success: false,
          message: `Service with ID ${item.serviceId} not found`
        });
      }
    }

    const template = new InvoiceTemplate({
      name,
      description,
      items,
      isActive,
      design
    });

    const savedTemplate = await template.save();

    res.status(201).json({
      success: true,
      data: savedTemplate
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating invoice template',
      error: err.message
    });
  }
};

// @desc    Update invoice template
// @route   PUT /api/invoice-templates/:id
// @access  Private/Admin
exports.updateTemplate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, description, items, isActive, design } = req.body;

    // Validate all services exist
    for (const item of items) {
      const serviceExists = await Service.findById(item.serviceId);
      if (!serviceExists) {
        return res.status(400).json({
          success: false,
          message: `Service with ID ${item.serviceId} not found`
        });
      }
    }

    const template = await InvoiceTemplate.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        items,
        isActive,
        design,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('items.serviceId', 'name description factor reference');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Invoice template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invoice template not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating invoice template',
      error: err.message
    });
  }
};

// @desc    Delete invoice template
// @route   DELETE /api/invoice-templates/:id
// @access  Private/Admin
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await InvoiceTemplate.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Invoice template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invoice template not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting invoice template',
      error: err.message
    });
  }
};