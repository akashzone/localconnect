const Application = require("../models/Application");
const Project = require("../models/Project");

const applyToProject = async (req, res) => {
  try {
    const { projectId, coverLetter, estimatedDuration } = req.body;

    if (!projectId || !coverLetter || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const isAlreadyApplied = await Application.findOne({
      projectId,
      developerId: req.user.id,
    });
    if (isAlreadyApplied) {
      return res
        .status(400)
        .json({ message: "User already applied to this project" });
    }

    const project = await Project.findById(projectId);

    //Here I'm checking does the project exist using projectId
    //Because If I don't do this here anyone with project - 12321 can create applicaton..

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }
    const apply = await Application.create({
      projectId,
      coverLetter,
      estimatedDuration,
      developerId: req.user.id,
    });
    console.log("Applied to project successfully : ", apply);
    res
      .status(201)
      .json({ message: "Applied to project successfully", data: apply });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const getApplications = await Application.find({
      developerId: req.user.id,
    });
    if (!getApplications) {
      return res.status(401).json({
        message: "Applications not found, apply to projects first..",
      });
    }
    res.status(200).json({
      message: "My Applications fetched Successfully :",
      data: getApplications,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getApplicationsForProject = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(401).json({
      message: "projectID not found.",
    });
  }
  try {
    const applications = await Application.find({
      projectId,
    });

    if (!applications) {
      return res.status(401).json({
        message: "Applications not found for this project",
      });
    }

    console.log("Applications :", applications);
    return res.status(200).json({
      message: "Successfully fetched the applications..",
      data: applications,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  applyToProject,
  getMyApplications,
  getApplicationsForProject,
};
