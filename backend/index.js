require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Routes
const authRoutes = require("./routes/auth");
const adminMeetingRoutes = require("./routes/admin_meeting");
const userMeetingRoutes = require("./routes/user_meeting");
const uploadPdfRoute = require("./routes/resume");
const transcriptionRoutes = require("./routes/transcription");
const evaluationRoutes = require("./routes/evaluation");
const userRoutes = require("./routes/userdetails");

// Initialize Express App
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/admin/meetings", adminMeetingRoutes);
app.use("/user/meetings", userMeetingRoutes);
app.use("/api", uploadPdfRoute);
app.use("/api", transcriptionRoutes);
app.use("/api", evaluationRoutes);
app.use("/api", userRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

 
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Server Listening on Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
