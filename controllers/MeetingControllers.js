// controllers/meetingController.js
const Meeting = require('../models/MeetingModels');

// Create a new meeting (C)
exports.createMeeting = async (req, res) => {
    try {
        const { meetingType, dateFrom, dateTo, description, place, comments } = req.body;

        const newMeeting = new Meeting({
            meetingType,
            dateFrom,
            dateTo,
            description,
            place,
            comments,
        });

        const savedMeeting = await newMeeting.save();
        res.status(201).json(savedMeeting);
    } catch (error) {
        res.status(500).json({ message: 'Error creating meeting', error: error.message });
    }
};

// Get all meetings (R)
exports.getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meetings', error: error.message });
    }
};

// Get a meeting by ID (R)
exports.getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findById(id);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json(meeting);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meeting', error: error.message });
    }
};

// Update a meeting by ID (U)
exports.updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedMeeting = await Meeting.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the update data against the schema
        });

        if (!updatedMeeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json(updatedMeeting);
    } catch (error) {
        res.status(500).json({ message: 'Error updating meeting', error: error.message });
    }
};

// Delete a meeting by ID (D)
exports.deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMeeting = await Meeting.findByIdAndDelete(id);

        if (!deletedMeeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meeting', error: error.message });
    }
};