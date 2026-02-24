// models/Meeting.js
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    meetingType: {
        type: String,
        required: true,
        enum: ['Residential', 'Commercial'], // Only allow these values
    },
    dateFrom: {
        type: Date,
        required: true,
    },
    dateTo: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Meeting', meetingSchema);