const Property = require('../models/PropertyModels');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up upload directory
const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        // ✅ Image Formats
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'image/webp', 
        'image/svg+xml', 
        'image/tiff', 
        'image/bmp',
      
        // ✅ Document Formats
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      
        // ✅ Spreadsheet Formats
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv', // CSV files
      
        // ✅ Presentation Formats
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      
        // ✅ Text & Code Files
        'text/plain', // .txt
        'text/csv', // .csv
        'text/html', // .html
        'text/javascript', // .js
        'application/json', // .json
        'application/xml', // .xml
      
        // ✅ Compressed Files
        'application/zip', 
        'application/x-rar-compressed', // .rar
        'application/x-7z-compressed', // .7z
        'application/x-tar', // .tar
        'application/gzip', // .gz
      
        // ✅ Audio & Video Files
        'audio/mpeg', // .mp3
        'audio/wav', // .wav
        'audio/ogg', // .ogg
        'video/mp4', // .mp4
        'video/x-msvideo', // .avi
        'video/mpeg', // .mpeg
        'video/quicktime', // .mov
        'video/webm', // .webm
      ];
      
          if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only images, PDFs, Word, and Excel files are allowed.'), false);
};

const upload = multer({ storage, fileFilter });

// Create Property
const createProperty = async (req, res) => {
    try {
        const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/Uploads/${req.file.filename}` : '';
        const property = await Property.create({ ...req.body, leaseDeedExecutionDoc: fileUrl });
        res.status(201).json({ message: 'Property created successfully', data: property });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get All Properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json({ properties });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.status(200).json({ property });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Property by ID
const updatePropertyById = async (req, res) => {
    try {
        const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/Uploads/${req.file.filename}` : req.body.leaseDeedExecutionDoc;
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, { ...req.body, leaseDeedExecutionDoc: fileUrl }, { new: true });
        if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });
        res.status(200).json({ message: 'Property updated successfully', data: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Property by ID
const deletePropertyById = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.leaseDeedExecutionDoc) {
            const filePath = path.join(__dirname, '..', property.leaseDeedExecutionDoc);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { upload, createProperty, getProperties, getPropertyById, updatePropertyById, deletePropertyById };