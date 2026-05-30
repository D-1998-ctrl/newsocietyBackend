const Service = require('../models/ServiceModels');
const mongoose=require('mongoose')

const getAllServices = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get service by soceityID
const getServiceSocietyId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const services = await Service.find({ societyId });

    res.status(200).json(services); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create service by soceity Id
const createServiceBySoceityId = async (req, res) => {
  try {
    const { societyId } = req.params;

    const services = await Service.create({
      ...req.body,
      societyId,
    });

    res.status(201).json(services);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//updateServiceBySociety
const updateServiceBySociety = async (req, res) => {
  try {
    const { societyId, serviceId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updated = await Service.findOneAndUpdate(
      { _id: serviceId, societyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Service not found in this society" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//deleteServiceBySociety
const deleteServiceBySociety = async (req, res) => {
  try {
    const { societyId, serviceId } = req.params;

    // 1. ID Validation
    if (!mongoose.Types.ObjectId.isValid(societyId) ||
        !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

   
    const deletedService = await Service.findOneAndDelete(
      { _id: serviceId, societyId: societyId }
    );

    if (!deletedService) {
      return res.status(404).json({ error: 'Service not found in this society' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





module.exports = {
  getAllServices,
  getServiceSocietyId,
  createServiceBySoceityId,
  updateServiceBySociety,
  deleteServiceBySociety
};




















// const Service = require('../models/ServiceModels');
// const asyncHandler = require('express-async-handler');
// const { body, validationResult } = require('express-validator');

// //Get all services
// exports.getAllServices = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const services = await Service.find()
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: -1 });

//   const total = await Service.countDocuments();

//   res.status(200).json({
//     success: true,
//     count: services.length,
//     total,
//     pages: Math.ceil(total / limit),
//     currentPage: page,
//     data: services
//   });
// });

// //Get single service by ID
// exports.getServiceById = asyncHandler(async (req, res, next) => {
//   // Check if ID is valid MongoDB ObjectId
//   if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//     return res.status(400).json({
//       success: false,
//       error: 'Invalid service ID format'
//     });
//   }

//   const service = await Service.findById(req.params.id);

//   if (!service) {
//     return res.status(404).json({
//       success: false,
//       error: 'Service not found'
//     });
//   }

//   res.status(200).json({
//     success: true,
//     data: service
//   });
// });

// // Validation rules for create/update
// const serviceValidationRules = [
//   body('name')
//     .trim()
//     .notEmpty().withMessage('Service name is required')
//     .isLength({ max: 100 }).withMessage('Service name cannot exceed 100 characters'),
//   body('description')
//     .trim()
//     .notEmpty().withMessage('Description is required')
//     .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
// ];

// //Create new service
// exports.createService = [
//   ...serviceValidationRules,
  
//   asyncHandler(async (req, res) => {
   

//     const { name, description, reference, factor } = req.body;
//     console.log("Data = ",name, description, reference, factor )

//     // Check if service with same name already exists
//     const existingService = await Service.findOne({ name });
//     if (existingService) {
//       return res.status(400).json({
//         success: false,
//         error: 'Service with this name already exists'
//       });
//     }

//     const service = await Service.create({
//       name,
//       description,
//       reference,
//       factor
//     });

//     res.status(201).json({
//       success: true,
//       data: service
//     });
//   })
// ];

// //Update service
// exports.updateService = [
//   ...serviceValidationRules,
  
//   asyncHandler(async (req, res) => {
//     // Validate ID format
//     if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid service ID format'
//       });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const { name, description, reference, factor } = req.body;
//     console.log("Updated Data",name, description, reference, factor)

//     let service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         error: 'Service not found'
//       });
//     }

//     // Check if name is being changed to one that already exists
//     if (name !== service.name) {
//       const existingService = await Service.findOne({ name });
//       if (existingService) {
//         return res.status(400).json({
//           success: false,
//           error: 'Service with this name already exists'
//         });
//       }
//     }

//     service.name = name;
//     service.description = description;
//     service.reference = reference;
//     service.factor = factor;

//     await service.save();

//     res.status(200).json({
//       success: true,
//       data: service
//     });
//   })
// ];

// //  Delete service
// exports.deleteService = asyncHandler(async (req, res) => {
//   // Validate ID format
//   if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//     return res.status(400).json({
//       success: false,
//       error: 'Invalid service ID format'
//     });
//   }

//   const service = await Service.findById(req.params.id);

//   if (!service) {
//     return res.status(404).json({
//       success: false,
//       error: 'Service not found'
//     });
//   }

//   await service.deleteOne();

//   res.status(200).json({
//     success: true,
//     data: {}
//   });
// });

// // Search services by name or description
// exports.searchServices = asyncHandler(async (req, res) => {
//   const query = req.query.q;
  
//   if (!query || query.trim().length < 3) {
//     return res.status(400).json({
//       success: false,
//       error: 'Search query must be at least 3 characters long'
//     });
//   }

//   const services = await Service.find({
//     $or: [
//       { name: { $regex: query, $options: 'i' } },
//       { description: { $regex: query, $options: 'i' } }
//     ]
//   }).limit(10);

//   res.status(200).json({
//     success: true,
//     count: services.length,
//     data: services
//   });
// });