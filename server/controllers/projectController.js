const BusinessProfile = require("../models/BusinessProfile");
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

module.exports = { createProject };
