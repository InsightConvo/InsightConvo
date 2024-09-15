// routes/meetings.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Meeting = require('../models/meeting');
const jwtSecret = process.env.JWT_SECRET;


// Middleware to verify token and extract user info
const authenticate = (req, res, next) => {
    const token = req.headers.authorization; // Directly get the token
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  

// Get all meetings for the interviewer
router.get('/', authenticate, async (req, res) => {
  try {
    const interviewerEmail = req.user.email; // Get interviewer's email from the decoded token

    const meetings = await Meeting.find({ interviewerEmail }); // Fetch meetings for this interviewer
    const currentDate = new Date();

    // Map meetings to include 'isUpcoming'
    const formattedMeetings = meetings.map(meeting => ({
      ...meeting._doc,
      isUpcoming: new Date(meeting.date) >= currentDate,
    }));

    res.json(formattedMeetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Create a new meeting
router.post('/', async (req, res) => {
  const { name, date, time, intervieweeName, email, role, jobDescription, interviewType, importantQuestions, interviewerName, interviewerEmail } = req.body;

  try {
    const meeting = new Meeting({
      name,
      date,
      time,
      intervieweeName,
      email,
      role,
      jobDescription,
      interviewType,
      importantQuestions,
      interviewerName,
      interviewerEmail

    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create meeting' });
  }
});

// Update a meeting
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, time, intervieweeName, email, role, jobDescription, interviewType, importantQuestions } = req.body;

  try {
    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { name, date, time, intervieweeName, email, role, jobDescription, interviewType, importantQuestions },
      { new: true }
    );
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update meeting' });
  }
});

// Delete a meeting
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Meeting.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete meeting' });
  }
});

module.exports = router;
