const BusinessProfile = require("../models/BusinessProfile");
const mongoose = require("mongoose");
const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const {
      title,
      budget,
      description,
      price,
      deadline,
      category,
      skillsRequired,
      status,
      selectedDeveloper,
    } = req.body;
    if (!title || !description || !budget || !deadline || !category) {
      return res.status(400).json({
        message: "All required fields are mandatory.",
      });
    }

    const businessOwnerInfo = await BusinessProfile.findOne({
      userId: req.user.id,
    }).populate("userId", "name email role");

    console.log("Business Profile Info - ", businessOwnerInfo);
    // const businessId = businessOwnerInfo._id;
    const project = await Project.create({
      title,
      description,
      budget,
      deadline,
      category,
      skillsRequired,
      businessOwnerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "Open" });

    if (!projects) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const projectsWithProfile = await Promise.all(
      projects.map(async (project) => {
        const projectObj = project.toObject();
        const businessProfile = await BusinessProfile.findOne({
          userId: project.businessOwnerId,
        });
        projectObj.businessProfile = businessProfile || null;
        return projectObj;
      })
    );

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projectsWithProfile,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Project ID.",
    });
  }
  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const projectObj = project.toObject();

    // Fetch the business profile linked to the businessOwnerId (User ID)
    const businessProfile = await BusinessProfile.findOne({ userId: project.businessOwnerId });
    projectObj.businessProfile = businessProfile || null;

    console.log("Project INFO - ", projectObj);

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: projectObj,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Project ID.",
    });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }
    console.log("Updated Project - ", updatedProject);
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Project ID.",
    });
  }

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    console.log("Deleted Project - ", deletedProject);
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }
    res.status(204).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getMyProjects = async (req, res) => {
  const businessOwnerId = req.user.id;
  try {
    const projects = await Project.find({
      businessOwnerId,
    });
    console.log("All projects - ", projects);
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getAssignedProjects = async (req, res) => {
  const studentId = req.user.id;
  try {
    const acceptedProjects = await Project.find({
      selectedStudent: studentId,
      status: { $in: ["In Progress", "Under Review", "Completed", "Cancelled"] }
    });

    const projectsWithProfile = await Promise.all(
      acceptedProjects.map(async (project) => {
        const projectObj = project.toObject();
        const businessProfile = await BusinessProfile.findOne({
          userId: project.businessOwnerId,
        });
        projectObj.businessProfile = businessProfile || null;
        return projectObj;
      })
    );

    console.log("Accepted projects, that we have applied for :", projectsWithProfile);
    return res.status(200).json({
      success: true,
      message: "acceptedProjects fetched successfully",
      data: projectsWithProfile,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getAssignedProjects,
};
