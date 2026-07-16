const mongoose = require("mongoose");

const developerProfileSchema = new mongoose.Schema(
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
    },

    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DeveloperProfile = mongoose.model("DeveloperProfile", developerProfileSchema);

module.exports = DeveloperProfile;