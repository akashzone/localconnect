const mongoose = require("mongoose");
const Application = require("../models/Application");
const Project = require("../models/Project");
const User = require("../models/User");
const BusinessProfile = require("../models/BusinessProfile");
const StudentProfile = require("../models/StudentProfile");

const getAllSubmissions = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const query = {
      "workSubmission.workLink": { $exists: true, $ne: "" }
    };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      // 1. Match students
      const matchedStudents = await User.find({
        role: "student",
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select("_id");
      const studentIds = matchedStudents.map(s => s._id);

      // 2. Match projects
      const matchedProjects = await Project.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).select("_id");
      let projectIds = matchedProjects.map(p => p._id);

      // 3. Match business profiles
      const matchedBusinessProfiles = await BusinessProfile.find({
        businessName: searchRegex
      }).select("userId");
      const businessOwnerUserIds = matchedBusinessProfiles.map(bp => bp.userId);

      if (businessOwnerUserIds.length > 0) {
        const businessProjects = await Project.find({
          businessOwnerId: { $in: businessOwnerUserIds }
        }).select("_id");
        projectIds = [...new Set([...projectIds.map(id => id.toString()), ...businessProjects.map(id => id.toString())])].map(id => new mongoose.Types.ObjectId(id));
      }

      // Apply $or filter nested with the main query
      const searchOr = [];
      if (studentIds.length > 0) {
        searchOr.push({ studentId: { $in: studentIds } });
      }
      if (projectIds.length > 0) {
        searchOr.push({ projectId: { $in: projectIds } });
      }

      if (searchOr.length > 0) {
        query.$or = searchOr;
      } else {
        return res.status(200).json({
          success: true,
          message: "Submissions fetched successfully (empty)",
          data: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0,
          }
        });
      }
    }

    const total = await Application.countDocuments(query);
    const submissions = await Application.find(query)
      .sort({ "workSubmission.submittedAt": -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("studentId", "name email")
      .populate({
        path: "projectId",
        select: "title businessOwnerId"
      });

    const subObjs = submissions.map(s => s.toObject());

    // Fetch details for business owner user & corporate name
    const businessOwnerIds = [...new Set(subObjs.map(s => s.projectId?.businessOwnerId?.toString()).filter(Boolean))];
    
    const businessProfiles = await BusinessProfile.find({ userId: { $in: businessOwnerIds } }).select("userId businessName");
    const businessProfileMap = {};
    businessProfiles.forEach(bp => {
      businessProfileMap[bp.userId.toString()] = bp;
    });

    const businessOwnerUsers = await User.find({ _id: { $in: businessOwnerIds } }).select("name email");
    const businessOwnerUserMap = {};
    businessOwnerUsers.forEach(u => {
      businessOwnerUserMap[u._id.toString()] = u;
    });

    subObjs.forEach(s => {
      if (s.projectId && s.projectId.businessOwnerId) {
        const boId = s.projectId.businessOwnerId.toString();
        s.projectId.businessOwner = businessOwnerUserMap[boId] || null;
        s.projectId.businessProfile = businessProfileMap[boId] || null;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      data: subObjs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      }
    });
  } catch (error) {
    console.error("Admin getAllSubmissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching submissions",
      error: error.message,
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID format",
      });
    }

    const application = await Application.findById(id)
      .populate("studentId", "name email")
      .populate("projectId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application record not found",
      });
    }

    if (!application.workSubmission || !application.workSubmission.workLink) {
      return res.status(404).json({
        success: false,
        message: "No work submission found for this application record",
      });
    }

    const appObj = application.toObject();

    // Fetch related profiles
    const studentProfile = await StudentProfile.findOne({ userId: application.studentId?._id });
    
    let businessOwner = null;
    let businessProfile = null;
    if (application.projectId?.businessOwnerId) {
      businessOwner = await User.findById(application.projectId.businessOwnerId).select("name email role");
      businessProfile = await BusinessProfile.findOne({ userId: application.projectId.businessOwnerId });
    }

    return res.status(200).json({
      success: true,
      message: "Submission details fetched successfully",
      data: {
        application: appObj,
        studentProfile,
        businessOwner,
        businessProfile,
      }
    });
  } catch (error) {
    console.error("Admin getSubmissionById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching submission details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSubmissions,
  getSubmissionById,
};
