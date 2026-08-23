const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["Open", "In Progress", "Under Review", "Changes Requested", "Completed", "Cancelled"],
      default: "Open",
    },

    businessOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
    },

    selectedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);