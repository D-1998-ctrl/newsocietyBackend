const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  parkingType: {
    type: String,
    required: true
  },
  parkingArea: {
    type: String, // in square meters
    required: true
  },
  unit: {
    type: String, // in square meters
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
