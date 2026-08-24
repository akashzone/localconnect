
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },

    estimatedDuration: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Withdrawn"],
      default: "Pending",
    },

    workSubmission: {
      workLink: {
        type: String,
        trim: true,
      },
      remarks: {
        type: String,
        trim: true,
      },
      submittedAt: {
        type: Date,
      },
    },

    changeRequests: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
        },
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["Pending", "Resolved"],
          default: "Pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);