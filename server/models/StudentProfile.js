const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    linkedIn: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },

    portfolio: {
      type: String,
      trim: true,
    },

    github: {
      type: String,
      trim: true,
    },

    resume: {
      type: String,
      trim: true,
    },

    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

module.exports = StudentProfile;