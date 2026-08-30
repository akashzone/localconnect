const mongoose = require("mongoose");
const Report = require("../models/Report");
const User = require("../models/User");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Review = require("../models/Review");

const createReport = async (req, res) => {
  try {
    const reporterId = req.user?.id;
    const reporterRole = req.user?.role;

    if (!reporterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (reporterRole === "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrators cannot submit user reports.",
      });
    }

    const {
      reportedUserId,
      projectId,
      applicationId,
      reviewId,
      reason,
      description,
    } = req.body;

    // Validate reason
    const allowedReasons = [
      "Fraud / Scam",
      "Harassment",
      "Inappropriate Behavior",
      "Fake Profile",
      "Spam",
      "Payment Issue",
      "Project Issue",
      "Work Quality Issue",
      "Suspicious Activity",
      "Other",
    ];

    if (!reason || !allowedReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing report reason.",
      });
    }

    // Validate description
    if (!description || typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters.",
      });
    }

    if (trimmedDesc.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 1000 characters.",
      });
    }

    // Must have at least one target
    if (!reportedUserId && !projectId && !applicationId && !reviewId) {
      return res.status(400).json({
        success: false,
        message: "At least one target (user, project, application, or review) must be reported.",
      });
    }

    // Validate reportedUserId
    if (reportedUserId) {
      if (!mongoose.Types.ObjectId.isValid(reportedUserId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reported user ID format.",
        });
      }

      if (reportedUserId.toString() === reporterId.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot report yourself.",
        });
      }

      const reportedUser = await User.findById(reportedUserId);
      if (!reportedUser) {
        return res.status(404).json({
          success: false,
          message: "Reported user not found.",
        });
      }
    }

    // Validate projectId
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID format.",
        });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Reported project not found.",
        });
      }
    }

    // Validate applicationId
    if (applicationId) {
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID format.",
        });
      }

      const application = await Application.findById(applicationId).populate("projectId");
      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Reported application not found.",
        });
      }

      // Verify relation: reporter must be student or project owner
      const isRelatedStudent = application.studentId.toString() === reporterId.toString();
      const isRelatedBusiness = application.projectId?.businessOwnerId?.toString() === reporterId.toString();

      if (!isRelatedStudent && !isRelatedBusiness) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to report this application.",
        });
      }
    }

    // Validate reviewId
    if (reviewId) {
      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID format.",
        });
      }

      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Reported review not found.",
        });
      }

      // Verify relation: reporter must be either student or business owner of the review
      const isRelated =
        review.studentId.toString() === reporterId.toString() ||
        review.businessOwnerId.toString() === reporterId.toString();

      if (!isRelated) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to report this review.",
        });
      }
    }

    // Check for duplicate pending reports
    const duplicateQuery = {
      reporterId,
      reason,
      status: "Pending",
    };

    if (reportedUserId) duplicateQuery.reportedUserId = reportedUserId;
    if (projectId) duplicateQuery.projectId = projectId;
    if (applicationId) duplicateQuery.applicationId = applicationId;
    if (reviewId) duplicateQuery.reviewId = reviewId;

    const existingReport = await Report.findOne(duplicateQuery);
    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending report for this issue.",
      });
    }

    // Create Report
    const report = await Report.create({
      reporterId,
      reportedUserId: reportedUserId || null,
      projectId: projectId || null,
      applicationId: applicationId || null,
      reviewId: reviewId || null,
      reason,
      description: trimmedDesc,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
      data: {
        _id: report._id,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while submitting report.",
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
};
