const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema({
    landAuthority:{
        type: String
    },
    leaseDeedExecution:{
        type: String
    },
    leaseDeedExecutionRegNum:{
        type: String
    },
    leaseDeedExecutionDoc:{
        type: String
    },
    leaseDeedExecutionDate:{
        type: String
    },
    leasePeriod:{
        type: String
    },
    leaseRentPremium:{
        type: String
    },
    CTSNo:{
        type: String,
        required: true
    },
    Village:{
        type: String
    },
    plotNo:{
        type: String
    },
    plotArea:{
        type: String
    },
    onEast:{
        type: String,
        required: true
    },
    onWest:{
        type: String,
        required: true
    },
    onNorth:{
        type: String,
        required: true
    },
    onSouth:{
        type: String,
        required: true
    },
    conveyanceDeed:{
        type: String
    },
    conveyanceDeedRegNum:{
        type: String,
    },
    conveyanceDeedDate:{
        type: String
    },
    landConveyanceInNameOf:{
        type: String
    },
    nonAgricultureTax:{
        type: String
    },
    nATaxPremium:{
        type: String
    },
    propertyTaxAuthority:{
        type: String
    },
    propertyTaxNo:{
        type: String,
        required: true
    },
    propertyTaxPremium:{
        type: String
    },
    propertyTaxPremiumGSTINBills:{
        type: String
    },
    waterSupplyAuthority:{
        type: String
    },
    numOfWaterConnections:{
        type: String
    },
    waterConnectionNum:{
        type: String
    },
    waterBillGenerationDates:{
        type: String
    },
    waterBillGenerationDatesGSTINBills:{
        type: String
    },
    electricitySupplyServiceProvider:{
        type: String
    },
    numOfElectricityConnections:{
        type: String
    }
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;