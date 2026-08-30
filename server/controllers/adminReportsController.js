const mongoose = require("mongoose");
const Report = require("../models/Report");
const User = require("../models/User");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Review = require("../models/Review");
const StudentProfile = require("../models/StudentProfile");
const BusinessProfile = require("../models/BusinessProfile");

const getAllReports = async (req, res) => {
  try {
    const { search, status, priority, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const query = {};

    if (status && ["Pending", "Under Review", "Resolved", "Dismissed"].includes(status)) {
      query.status = status;
    }

    if (priority && ["Low", "Medium", "High", "Critical"].includes(priority)) {
      query.priority = priority;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      // Find user ids matching name/email
      const matchingUsers = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }],
      }).select("_id");
      const matchingUserIds = matchingUsers.map((u) => u._id);

      // Find project ids matching title
      const matchingProjects = await Project.find({ title: searchRegex }).select("_id");
      const matchingProjectIds = matchingProjects.map((p) => p._id);

      query.$or = [
        { reason: searchRegex },
        { description: searchRegex },
        { reporterId: { $in: matchingUserIds } },
        { reportedUserId: { $in: matchingUserIds } },
        { projectId: { $in: matchingProjectIds } },
      ];
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate("reporterId", "name email role")
      .populate("reportedUserId", "name email role")
      .populate("projectId", "title")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error("Admin getAllReports error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
      error: error.message,
    });
  }
};

const getReportStats = async (req, res) => {
  try {
    const [total, pending, underReview, resolved, dismissed, reasons] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: "Pending" }),
      Report.countDocuments({ status: "Under Review" }),
      Report.countDocuments({ status: "Resolved" }),
      Report.countDocuments({ status: "Dismissed" }),
      Report.aggregate([{ $group: { _id: "$reason", count: { $sum: 1 } } }]),
    ]);

    const reasonCounts = {};
    reasons.forEach((r) => {
      if (r._id) {
        reasonCounts[r._id] = r.count;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Report statistics fetched successfully",
      data: {
        total,
        pending,
        underReview,
        resolved,
        dismissed,
        reasons: reasonCounts,
      },
    });
  } catch (error) {
    console.error("Admin getReportStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching report stats",
      error: error.message,
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
      });
    }

    const report = await Report.findById(id)
      .populate("reporterId", "name email role")
      .populate("reportedUserId", "name email role")
      .populate("projectId")
      .populate({
        path: "applicationId",
        populate: { path: "projectId", select: "title" },
      })
      .populate({
        path: "reviewId",
        populate: { path: "projectId", select: "title" },
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const reportObj = report.toObject();

    // Fetch related student and business profiles where appropriate
    if (report.reporterId) {
      if (report.reporterId.role === "student") {
        reportObj.reporterProfile = await StudentProfile.findOne({ userId: report.reporterId._id });
      } else if (report.reporterId.role === "business") {
        reportObj.reporterProfile = await BusinessProfile.findOne({ userId: report.reporterId._id });
      }
    }

    if (report.reportedUserId) {
      if (report.reportedUserId.role === "student") {
        reportObj.reportedUserProfile = await StudentProfile.findOne({ userId: report.reportedUserId._id });
      } else if (report.reportedUserId.role === "business") {
        reportObj.reportedUserProfile = await BusinessProfile.findOne({ userId: report.reportedUserId._id });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Report details fetched successfully",
      data: reportObj,
    });
  } catch (error) {
    console.error("Admin getReportById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching report details",
      error: error.message,
    });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
      });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (status) {
      const allowedStatuses = ["Pending", "Under Review", "Resolved", "Dismissed"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value.",
        });
      }

      const currentStatus = report.status;
      if (currentStatus === "Resolved" || currentStatus === "Dismissed") {
        return res.status(400).json({
          success: false,
          message: "Resolved or dismissed reports cannot be updated.",
        });
      }

      if (currentStatus === "Pending" && status !== "Under Review") {
        return res.status(400).json({
          success: false,
          message: "Pending reports can only transition to Under Review.",
        });
      }

      if (currentStatus === "Under Review" && status !== "Resolved" && status !== "Dismissed") {
        return res.status(400).json({
          success: false,
          message: "Under Review reports can only transition to Resolved or Dismissed.",
        });
      }

      report.status = status;
    }

    if (priority) {
      const allowedPriorities = ["Low", "Medium", "High", "Critical"];
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority value.",
        });
      }

      // If the report status is already finalized, prevent any priority change too
      if (report.status === "Resolved" || report.status === "Dismissed") {
        return res.status(400).json({
          success: false,
          message: "Finalized reports cannot change priority.",
        });
      }

      report.priority = priority;
    }

    await report.save();

    // Populate and fetch full details for response
    const updatedReport = await Report.findById(id)
      .populate("reporterId", "name email role")
      .populate("reportedUserId", "name email role")
      .populate("projectId", "title");

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Admin updateReportStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating report",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReports,
  getReportStats,
  getReportById,
  updateReportStatus,
};
