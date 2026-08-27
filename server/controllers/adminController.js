const User = require("../models/User");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Review = require("../models/Review");

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

module.exports = {
  getAdminDashboard,
};
