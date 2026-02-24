// controllers/serviceController.js
const Service = require('../models/ServiceModels');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// @desc    Get all services
// @route   GET /api/services
// @access  Private/Public (depending on your auth requirements)
exports.getAllServices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const services = await Service.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Service.countDocuments();

  res.status(200).json({
    success: true,
    count: services.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: services
  });
});

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Private/Public
exports.getServiceById = asyncHandler(async (req, res, next) => {
  // Check if ID is valid MongoDB ObjectId
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid service ID format'
    });
  }

  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      error: 'Service not found'
    });
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

// Validation rules for create/update
const serviceValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Service name is required')
    .isLength({ max: 100 }).withMessage('Service name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

// @desc    Create new service
// @route   POST /api/services
// @access  Private
exports.createService = [
  ...serviceValidationRules,
  
  asyncHandler(async (req, res) => {
   

    const { name, description, reference, factor } = req.body;
    console.log("Data = ",name, description, reference, factor )

    // Check if service with same name already exists
    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({
        success: false,
        error: 'Service with this name already exists'
      });
    }

    const service = await Service.create({
      name,
      description,
      reference,
      factor
    });

    res.status(201).json({
      success: true,
      data: service
    });
  })
];

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
exports.updateService = [
  ...serviceValidationRules,
  
  asyncHandler(async (req, res) => {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid service ID format'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, reference, factor } = req.body;
    console.log("Updated Data",name, description, reference, factor)

    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Check if name is being changed to one that already exists
    if (name !== service.name) {
      const existingService = await Service.findOne({ name });
      if (existingService) {
        return res.status(400).json({
          success: false,
          error: 'Service with this name already exists'
        });
      }
    }

    service.name = name;
    service.description = description;
    service.reference = reference;
    service.factor = factor;

    await service.save();

    res.status(200).json({
      success: true,
      data: service
    });
  })
];

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
exports.deleteService = asyncHandler(async (req, res) => {
  // Validate ID format
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid service ID format'
    });
  }

  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      error: 'Service not found'
    });
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Search services by name or description
// @route   GET /api/services/search?q=
// @access  Private/Public
exports.searchServices = asyncHandler(async (req, res) => {
  const query = req.query.q;
  
  if (!query || query.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Search query must be at least 3 characters long'
    });
  }

  const services = await Service.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  }).limit(10);

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});