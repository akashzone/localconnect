const mongoose = require("mongoose");
const Application = require("../models/Application");
const Project = require("../models/Project");
const Message = require("../models/Message");
const BusinessProfile = require("../models/BusinessProfile");

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
      studentId: req.user.id,
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
      studentId: req.user.id,
    });
    await apply.populate("projectId");
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
      studentId: req.user.id,
    }).populate(
      "projectId",
      "title budget deadline category status businessOwnerId",
    );

    if (!getApplications) {
      return res.status(401).json({
        message: "Applications not found, apply to projects first..",
      });
    }

    // Attach businessProfile to each project
    const applicationsWithProfile = await Promise.all(
      getApplications.map(async (app) => {
        const appObj = app.toObject();
        if (appObj.projectId && appObj.projectId.businessOwnerId) {
          const businessProfile = await BusinessProfile.findOne({
            userId: appObj.projectId.businessOwnerId,
          });
          appObj.projectId.businessProfile = businessProfile || null;
        }
        return appObj;
      })
    );

    console.log("Applications - ", applicationsWithProfile);
    res.status(200).json({
      message: "My Applications fetched Successfully :",
      data: applicationsWithProfile,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getBusinessApplications = async (req, res) => {
  try {
    const projects = await Project.find({
      businessOwnerId: req.user.id,
    }).select("_id");

    if (!projects) {
      return res.status(404).json({
        message: "Projects not found",
      });
    }

    const projectIds = projects.map((project) => project._id);

    const applications = await Application.find({
      projectId: { $in: projectIds },
    })
      .populate("studentId", "name email")
      .populate("projectId", "title budget status")
      .sort({ createdAt: -1 });

    console.log("Applications - ", applications);
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications.",
    });
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
    }).populate("projectId").populate("studentId", "name email");

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

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Application ID is required",
    });
  }

  const allowedStatus = ["Pending", "Accepted", "Rejected", "Withdrawn"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid application status",
    });
  }

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const project = await Project.findById(application.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!project.businessOwnerId.equals(req.user.id)) {
      return res.status(403).json({
        message: "You are not authorized to update this application",
      });
    }

    if (application.status === "Accepted") {
      return res.status(400).json({
        message: "Application has already been accepted",
      });
    }

    application.status = status;
    await application.save();

    let updatedProject = null;

    if (status === "Accepted") {
      updatedProject = await Project.findByIdAndUpdate(
        application.projectId,
        {
          status: "In Progress",
          selectedStudent: application.studentId,
        },
        {
          new: true,
        },
      );

      await Application.updateMany(
        {
          projectId: application.projectId,
          _id: { $ne: application._id },
        },
        {
          status: "Rejected",
        },
      );
    }

    return res.status(200).json({
      success: true,
      message:
        status === "Accepted"
          ? "Student selected successfully."
          : "Application status updated successfully.",
      application,
      updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const withdrawApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to withdraw this application.",
      });
    }

    if (application.status === "Withdrawn") {
      return res.status(400).json({
        success: false,
        message: "Application has already been withdrawn.",
      });
    }

    application.status = "Withdrawn";
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const submitWork = async (req, res) => {
  const { id } = req.params;
  const { workLink, remarks } = req.body;

  if (!workLink) {
    return res.status(400).json({
      success: false,
      message: "Work link is required.",
    });
  }

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to submit work for this application.",
      });
    }

    if (application.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "You can only submit work for accepted applications.",
      });
    }

    const project = await Project.findById(application.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (project.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "You can only submit work when the project is In Progress.",
      });
    }

    application.workSubmission = {
      workLink,
      remarks,
      submittedAt: new Date(),
    };

    // Automatically resolve any pending change requests on submission
    if (application.changeRequests && application.changeRequests.length > 0) {
      application.changeRequests.forEach((reqItem) => {
        if (reqItem.status === "Pending") {
          reqItem.status = "Resolved";
        }
      });
    }

    await application.save();

    // Update project status to "Under Review"
    project.status = "Under Review";
    await project.save();

    await application.populate(
      "projectId",
      "title budget deadline category status businessOwnerId"
    );

    return res.status(200).json({
      success: true,
      message: "Work submitted successfully for review.",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const requestChanges = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Change request message is required.",
    });
  }

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const project = await Project.findById(application.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Verify authorization: logged in user must be the business owner of the project
    if (project.businessOwnerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to request changes for this application.",
      });
    }

    // Verify status is Under Review
    if (project.status !== "Under Review") {
      return res.status(400).json({
        success: false,
        message: "You can only request changes when a project is Under Review.",
      });
    }

    // Add change request
    if (!application.changeRequests) {
      application.changeRequests = [];
    }

    application.changeRequests.push({
      message: message.trim(),
      requestedBy: req.user.id,
      requestedAt: new Date(),
      status: "Pending",
    });

    await application.save();

    // Change project status back to In Progress
    project.status = "In Progress";
    await project.save();

    const updatedApplication = await Application.findById(id)
      .populate("studentId", "name email")
      .populate("projectId", "title budget status");

    return res.status(200).json({
      success: true,
      message: "Changes requested successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const approveWork = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const project = await Project.findById(application.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Verify authorization: logged in user must be the business owner of the project
    if (project.businessOwnerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to approve work for this application.",
      });
    }

    // Verify project status is Under Review
    if (project.status !== "Under Review") {
      return res.status(400).json({
        success: false,
        message: "You can only approve work when a project is Under Review.",
      });
    }

    // Verify work submission exists
    if (!application.workSubmission || !application.workSubmission.workLink) {
      return res.status(400).json({
        success: false,
        message: "No work submission found to approve.",
      });
    }

    // Update project status to Completed
    project.status = "Completed";
    await project.save();

    const updatedApplication = await Application.findById(id)
      .populate("studentId", "name email")
      .populate("projectId", "title budget status");

    return res.status(200).json({
      success: true,
      message: "Work approved successfully. Project marked as Completed.",
      data: updatedApplication,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const getApplicationById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Application ID.",
    });
  }

  try {
    const application = await Application.findById(id)
      .populate("studentId", "name email")
      .populate("projectId", "title budget deadline category status businessOwnerId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const project = application.projectId;
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Associated project not found.",
      });
    }

    const isStudent = application.studentId._id.toString() === req.user.id.toString();
    const isBusinessOwner = project.businessOwnerId.toString() === req.user.id.toString();

    if (!isStudent && !isBusinessOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this application.",
      });
    }

    const applicationObj = application.toObject();
    const businessProfile = await BusinessProfile.findOne({ userId: project.businessOwnerId });
    applicationObj.projectId.businessProfile = businessProfile || null;

    return res.status(200).json({
      success: true,
      data: applicationObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const getChatMessages = async (req, res) => {
  const { id } = req.params; // applicationId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Application ID.",
    });
  }

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.status !== "Accepted") {
      return res.status(403).json({
        success: false,
        message: "Chat is only available for accepted applications.",
      });
    }

    const project = await Project.findById(application.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Associated project not found.",
      });
    }

    const isStudent = application.studentId.toString() === req.user.id.toString();
    const isBusinessOwner = project.businessOwnerId.toString() === req.user.id.toString();

    if (!isStudent && !isBusinessOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this chat.",
      });
    }

    const messages = await Message.find({ applicationId: id })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  applyToProject,
  getMyApplications,
  getBusinessApplications,
  getApplicationsForProject,
  updateApplicationStatus,
  withdrawApplication,
  submitWork,
  requestChanges,
  approveWork,
  getApplicationById,
  getChatMessages,
};
