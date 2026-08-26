const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  summary: {
    type: String,
    trim: true,
  },

  skills: {
    type: [String],
  },

  education: {
    type: [String],
  },

  experience: {
    type: [String],
  },

  projects: {
    type: [String],
  },

  certifications: {
    type: [String],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  embedding: {
    type: [Number],
    default: [],
  },
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
