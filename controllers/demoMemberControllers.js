const DemoMember = require('../models/DemoMember');
const DemoInvoice = require('../models/demoInvoicesmodels');
const { validationResult } = require('express-validator');

// @desc    Get all demo members
// @route   GET /api/demo-members
// @access  Public
exports.getAllDemoMembers = async (req, res) => {
  try {
    const members = await DemoMember.find()
      .populate('invoices', '-__v')
      .sort({ lastName: 1, firstName: 1 });

    res.status(200).json({
      data: members
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Get single demo member
// @route   GET /api/demo-members/:id
// @access  Public
exports.getDemoMemberById = async (req, res) => {
  try {
    const member = await DemoMember.findById(req.params.id)
      .populate('invoices', '-__v');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Demo member not found'
      });
    }

    res.status(200).json({
      data: member
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Demo member not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Create new demo member
// @route   POST /api/demo-members
// @access  Public
exports.createDemoMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { firstName, middleName, lastName, area, cc, invoices } = req.body;

    // Validate all invoices exist if provided
    if (invoices && invoices.length > 0) {
      for (const invoiceId of invoices) {
        const invoiceExists = await DemoInvoice.findById(invoiceId);
        if (!invoiceExists) {
          return res.status(400).json({
            success: false,
            message: `Invoice with ID ${invoiceId} not found`
          });
        }
      }
    }

    const member = new DemoMember({
      firstName,
      middleName,
      lastName,
      area,
      cc,
      invoices: invoices || []
    });

    const savedMember = await member.save();

    res.status(201).json({
      success: true,
      data: savedMember
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'CC must be unique'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating demo member',
      error: err.message
    });
  }
};

// @desc    Update demo member
// @route   PUT /api/demo-members/:id
// @access  Public
exports.updateDemoMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { firstName, middleName, lastName, area, cc, invoices } = req.body;

    // Validate all invoices exist if provided
    if (invoices && invoices.length > 0) {
      for (const invoiceId of invoices) {
        const invoiceExists = await DemoInvoice.findById(invoiceId);
        if (!invoiceExists) {
          return res.status(400).json({
            success: false,
            message: `Invoice with ID ${invoiceId} not found`
          });
        }
      }
    }

    const member = await DemoMember.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        middleName,
        lastName,
        area,
        cc,
        invoices: invoices || [],
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('invoices', '-__v');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Demo member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Demo member not found'
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'CC must be unique'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating demo member',
      error: err.message
    });
  }
};

// @desc    Delete demo member
// @route   DELETE /api/demo-members/:id
// @access  Public
exports.deleteDemoMember = async (req, res) => {
  try {
    const member = await DemoMember.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Demo member not found'
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
        message: 'Demo member not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting demo member',
      error: err.message
    });
  }
};