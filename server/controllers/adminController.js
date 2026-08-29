const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Review = require("../models/Review");
const StudentProfile = require("../models/StudentProfile");
const BusinessProfile = require("../models/BusinessProfile");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalBusinesses,
      totalAdmins,
      totalProjects,
      openProjects,
      inProgressProjects,
      underReviewProjects,
      changesRequestedProjects,
      completedProjects,
      cancelledProjects,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      withdrawnApplications,
      totalReviews,
      recentUsers,
      recentProjects,
      recentApplications,
      recentReviews,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "business" }),
      User.countDocuments({ role: "admin" }),
      Project.countDocuments(),
      Project.countDocuments({ status: "Open" }),
      Project.countDocuments({ status: "In Progress" }),
      Project.countDocuments({ status: "Under Review" }),
      Project.countDocuments({ status: "Changes Requested" }),
      Project.countDocuments({ status: "Completed" }),
      Project.countDocuments({ status: "Cancelled" }),
      Application.countDocuments(),
      Application.countDocuments({ status: "Pending" }),
      Application.countDocuments({ status: "Accepted" }),
      Application.countDocuments({ status: "Rejected" }),
      Application.countDocuments({ status: "Withdrawn" }),
      Review.countDocuments(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt"),
      Project.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title status createdAt"),
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("studentId", "name")
        .populate("projectId", "title")
        .select("status studentId projectId createdAt"),
      Review.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("reviewerRole stars description createdAt"),
    ]);

    // Transform database records into unified activity items
    const userActivities = recentUsers.map((u) => ({
      id: `user_${u._id}`,
      type: "user",
      title: `New ${u.role === "student" ? "student" : u.role === "business" ? "business" : "admin"} registered`,
      description: `${u.name} (${u.email}) joined as ${u.role}`,
      createdAt: u.createdAt,
    }));

    const projectActivities = recentProjects.map((p) => ({
      id: `project_${p._id}`,
      type: "project",
      title: p.status === "Completed" ? "Project completed" : "New project created",
      description: `"${p.title}" (${p.status})`,
      createdAt: p.createdAt,
    }));

    const applicationActivities = recentApplications.map((a) => ({
      id: `app_${a._id}`,
      type: "application",
      title: "New application submitted",
      description: `${a.studentId?.name || "Student"} applied for "${a.projectId?.title || "Project"}"`,
      createdAt: a.createdAt,
    }));

    const reviewActivities = recentReviews.map((r) => ({
      id: `review_${r._id}`,
      type: "review",
      title: "New review submitted",
      description: `${r.stars}-star review submitted by ${r.reviewerRole}`,
      createdAt: r.createdAt,
    }));

    // Combine and sort recent activity by createdAt descending
    const combinedActivity = [
      ...userActivities,
      ...projectActivities,
      ...applicationActivities,
      ...reviewActivities,
    ]
      .filter((item) => item.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully.",
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          businesses: totalBusinesses,
          admins: totalAdmins,
        },
        projects: {
          total: totalProjects,
          open: openProjects,
          inProgress: inProgressProjects,
          underReview: underReviewProjects,
          changesRequested: changesRequestedProjects,
          completed: completedProjects,
          cancelled: cancelledProjects,
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications,
          withdrawn: withdrawnApplications,
        },
        reviews: {
          total: totalReviews,
        },
        recentActivity: combinedActivity,
        pendingActions: [],
      },
    });
  } catch (error) {
    console.error("Admin dashboard fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching admin dashboard data",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const query = {};

    if (role && ["student", "business", "admin"].includes(role)) {
      query.role = role;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      }
    });
  } catch (error) {
    console.error("Admin getAllUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === "business") {
      profile = await BusinessProfile.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: {
        user,
        profile,
      }
    });
  } catch (error) {
    console.error("Admin getUserById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user details",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getUserById,
};
