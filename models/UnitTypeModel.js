const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the UnitType
const unitTypeSchema = new Schema({
  name: {
    type: String,
    required: true, // The name is required
  },
  area: {
    type: Number,
    required: true, // The area is required
  },
  propertyType: {
    type: String,
    enum: ['residential', 'commercial'], // Restrict to 'residential' or 'commercial'
    required: true, // The property type is required
  },
  unit: {
    type: String,
    required: true, // The area is required
  },
});

// Create the model from the schema
const UnitType = mongoose.model('UnitType', unitTypeSchema);

module.exports = UnitType;
