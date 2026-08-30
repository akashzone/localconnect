const mongoose = require("mongoose");
const Review = require("../models/Review");
const User = require("../models/User");
const Project = require("../models/Project");
const StudentProfile = require("../models/StudentProfile");
const BusinessProfile = require("../models/BusinessProfile");
const Application = require("../models/Application");

const getAllReviews = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, rating, reviewerRole } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const query = {};

    if (rating) {
      const ratingVal = parseInt(rating, 10);
      if (!isNaN(ratingVal)) {
        query.stars = ratingVal;
      }
    }

    if (reviewerRole && ["student", "business"].includes(reviewerRole)) {
      query.reviewerRole = reviewerRole;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      // Find user ids matching name
      const matchingUsers = await User.find({ name: searchRegex }).select("_id");
      const matchingUserIds = matchingUsers.map(u => u._id);

      // Find project ids matching title
      const matchingProjects = await Project.find({ title: searchRegex }).select("_id");
      const matchingProjectIds = matchingProjects.map(p => p._id);

      query.$or = [
        { description: searchRegex },
        { studentId: { $in: matchingUserIds } },
        { businessOwnerId: { $in: matchingUserIds } },
        { projectId: { $in: matchingProjectIds } }
      ];
    }

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate("studentId", "name email role")
      .populate("businessOwnerId", "name email role")
      .populate("projectId", "title")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    console.error("Admin getAllReviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reviews",
      error: error.message
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID format"
      });
    }

    const review = await Review.findById(id)
      .populate("studentId", "name email role")
      .populate("businessOwnerId", "name email role")
      .populate("projectId");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    const reviewObj = review.toObject();

    // Fetch StudentProfile and BusinessProfile
    const studentProfile = await StudentProfile.findOne({ userId: review.studentId });
    const businessProfile = await BusinessProfile.findOne({ userId: review.businessOwnerId });

    reviewObj.studentProfile = studentProfile || null;
    reviewObj.businessProfile = businessProfile || null;

    // Fetch related application information if available
    let application = null;
    if (review.studentId && review.projectId) {
      application = await Application.findOne({
        studentId: review.studentId,
        projectId: review.projectId
      });
    }
    reviewObj.application = application || null;

    return res.status(200).json({
      success: true,
      message: "Review details fetched successfully",
      data: reviewObj
    });
  } catch (error) {
    console.error("Admin getReviewById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching review details",
      error: error.message
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewById
};
