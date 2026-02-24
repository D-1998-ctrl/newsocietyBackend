// routes/meetingRoutes.js
const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/MeetingControllers');

// Create a new meeting
router.post('/', meetingController.createMeeting);

// Get all meetings
router.get('/', meetingController.getAllMeetings);

// Get a meeting by ID
router.get('/:id', meetingController.getMeetingById);

// Update a meeting by ID
router.patch('/:id', meetingController.updateMeeting);

// Delete a meeting by ID
router.delete('/:id', meetingController.deleteMeeting);

module.exports = router;