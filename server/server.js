
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Feedback = require("./models/Feedback");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.log("MongoDB Error:", error.message));

app.get("/", (req, res) => {
  res.send("Online Survey Backend is Running!");
});

// Save survey answers
app.post("/api/feedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    res.status(201).json({
      message: "Survey submitted successfully!",
      feedback
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to save survey",
      error: error.message
    });
  }
});

// View all submitted surveys
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch surveys" });
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
