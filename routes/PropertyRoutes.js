const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/PropertyControllers'); 

router.post('/create', propertyController.upload.single('leaseDeedExecutionDoc'), propertyController.createProperty);

router.get('/getAll', propertyController.getProperties);

router.get('/get/:id', propertyController.getPropertyById);

router.put('/update/:id', propertyController.upload.single('leaseDeedExecutionDoc'), propertyController.updatePropertyById);

router.delete('/delete/:id', propertyController.deletePropertyById);

module.exports = router;
