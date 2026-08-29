const mongoose = require("mongoose");
const Application = require("../models/Application");
const Project = require("../models/Project");
const User = require("../models/User");
const BusinessProfile = require("../models/BusinessProfile");
const StudentProfile = require("../models/StudentProfile");

const getAllApplications = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const query = {};

    if (status && ["Pending", "Accepted", "Rejected", "Withdrawn"].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      // 1. Find matching student user IDs
      const matchedStudents = await User.find({
        role: "student",
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select("_id");
      const studentIds = matchedStudents.map(s => s._id);

      // 2. Find matching projects by title/description
      const matchedProjects = await Project.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).select("_id");
      let projectIds = matchedProjects.map(p => p._id);

      // 3. Find matching business profiles
      const matchedBusinessProfiles = await BusinessProfile.find({
        businessName: searchRegex
      }).select("userId");
      const matchedBusinessOwnerUserIds = matchedBusinessProfiles.map(bp => bp.userId);

      if (matchedBusinessOwnerUserIds.length > 0) {
        const businessProjects = await Project.find({
          businessOwnerId: { $in: matchedBusinessOwnerUserIds }
        }).select("_id");
        projectIds = [...new Set([...projectIds.map(id => id.toString()), ...businessProjects.map(id => id.toString())])].map(id => new mongoose.Types.ObjectId(id));
      }

      // Apply to query.$or
      query.$or = [];
      if (studentIds.length > 0) {
        query.$or.push({ studentId: { $in: studentIds } });
      }
      if (projectIds.length > 0) {
        query.$or.push({ projectId: { $in: projectIds } });
      }

      if (query.$or.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Applications fetched successfully (empty)",
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
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("studentId", "name email")
      .populate({
        path: "projectId",
        select: "title businessOwnerId"
      });

    const appObjs = applications.map(a => a.toObject());

    // Fetch related business owner user details and business profiles to display business name
    const businessOwnerIds = [...new Set(appObjs.map(a => a.projectId?.businessOwnerId?.toString()).filter(Boolean))];
    
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

    appObjs.forEach(a => {
      if (a.projectId && a.projectId.businessOwnerId) {
        const boId = a.projectId.businessOwnerId.toString();
        a.projectId.businessOwner = businessOwnerUserMap[boId] || null;
        a.projectId.businessProfile = businessProfileMap[boId] || null;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: appObjs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      }
    });
  } catch (error) {
    console.error("Admin getAllApplications error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
      error: error.message,
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID format",
      });
    }

    const application = await Application.findById(id)
      .populate("studentId", "name email")
      .populate("projectId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const appObj = application.toObject();

    // Fetch related student developer profile
    const studentProfile = await StudentProfile.findOne({ userId: application.studentId?._id });
    appObj.studentProfile = studentProfile || null;

    // Fetch project business owner details
    let businessOwner = null;
    let businessProfile = null;
    if (application.projectId?.businessOwnerId) {
      businessOwner = await User.findById(application.projectId.businessOwnerId).select("name email role");
      businessProfile = await BusinessProfile.findOne({ userId: application.projectId.businessOwnerId });
    }

    return res.status(200).json({
      success: true,
      message: "Application details fetched successfully",
      data: {
        application: appObj,
        studentProfile,
        businessOwner,
        businessProfile,
      }
    });
  } catch (error) {
    console.error("Admin getApplicationById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching application details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
};
