// // routes/serviceRoutes.js
// const express = require('express');
// const router = express.Router();
// const serviceController = require('../controllers/ServicesController');

// // CRUD Routes
// router.get('/', serviceController.getAllServices);
// router.get('/search', serviceController.searchServices);
// router.get('/:id', serviceController.getServiceById);
// router.post('/', serviceController.createService);
// router.put('/:id', serviceController.updateService);
// router.delete('/:id', serviceController.deleteService);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
    getAllServices,
    getServiceSocietyId,
    createServiceBySoceityId,
    updateServiceBySociety,
    deleteServiceBySociety
} = require('../controllers/ServicesController');


router.get('/', getAllServices)
router.get('/society/:societyId', getServiceSocietyId);
router.post("/society/:societyId/", createServiceBySoceityId);
router.put("/society/:societyId/services/:serviceId", updateServiceBySociety);
router.delete("/society/:societyId/services/:serviceId", deleteServiceBySociety);


module.exports = router;
