const Project = require("../models/Project");

const getBusinessDashboard = async (req, res) => {
  const businessId = req.user.id;

  try {
    const projects = await Project.find({
      businessOwnerId: businessId,
    });

    const dashboardData = {
      totalProjects: projects.length,

      openProjects: projects.filter(
        (project) => project.status === "Open"
      ).length,

      inProgressProjects: projects.filter(
        (project) => project.status === "In Progress"
      ).length,

      completedProjects: projects.filter(
        (project) => project.status === "Completed"
      ).length,
    };

    console.log("Business Dashboard");
    console.log("Business ID:", businessId);
    console.log("Projects:", projects);
    console.log("Dashboard Stats:", dashboardData);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully.",
      data: {
        dashboard: dashboardData,
        projects,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getBusinessDashboard,
};