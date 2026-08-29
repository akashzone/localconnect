const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const BusinessProfile = require("../models/BusinessProfile");
const StudentProfile = require("../models/StudentProfile");
const Application = require("../models/Application");

const getAllProjects = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const query = {};

    if (status && ["Open", "In Progress", "Under Review", "Changes Requested", "Completed", "Cancelled"].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const projectObjs = projects.map(p => p.toObject());

    // Fetch related users
    const businessOwnerIds = [...new Set(projectObjs.map(p => p.businessOwnerId?.toString()).filter(Boolean))];
    const selectedStudentIds = [...new Set(projectObjs.map(p => p.selectedStudent?.toString()).filter(Boolean))];
    const allUserIds = [...new Set([...businessOwnerIds, ...selectedStudentIds])];

    const users = await User.find({ _id: { $in: allUserIds } }).select("name email role");
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    // Fetch business profiles for corporate/business name details
    const businessProfiles = await BusinessProfile.find({ userId: { $in: businessOwnerIds } }).select("userId businessName profileImage");
    const businessProfileMap = {};
    businessProfiles.forEach(bp => {
      businessProfileMap[bp.userId.toString()] = bp;
    });

    projectObjs.forEach(p => {
      const boId = p.businessOwnerId?.toString();
      p.businessOwner = userMap[boId] || null;
      p.businessProfile = businessProfileMap[boId] || null;

      const studId = p.selectedStudent?.toString();
      p.student = studId ? (userMap[studId] || null) : null;
    });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projectObjs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      }
    });
  } catch (error) {
    console.error("Admin getAllProjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
      error: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const projectObj = project.toObject();

    // Fetch Business Owner user details and profile
    const businessOwner = await User.findById(project.businessOwnerId).select("name email role");
    const businessProfile = await BusinessProfile.findOne({ userId: project.businessOwnerId });
    projectObj.businessOwner = businessOwner || null;
    projectObj.businessProfile = businessProfile || null;

    // Fetch Selected Student user details and profile
    if (project.selectedStudent) {
      const student = await User.findById(project.selectedStudent).select("name email role");
      const studentProfile = await StudentProfile.findOne({ userId: project.selectedStudent });
      projectObj.student = student || null;
      projectObj.studentProfile = studentProfile || null;
    } else {
      projectObj.student = null;
      projectObj.studentProfile = null;
    }

    // Fetch applications
    const applications = await Application.find({ projectId: project._id })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    projectObj.applicationsCount = applications.length;
    projectObj.applications = applications;

    return res.status(200).json({
      success: true,
      message: "Project details fetched successfully",
      data: projectObj,
    });
  } catch (error) {
    console.error("Admin getProjectById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching project details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
};
