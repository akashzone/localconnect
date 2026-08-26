const express = require("express");

//controller functions
const { 
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
  getChatMessages
} = require("../controllers/applicationController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("student"), applyToProject);
router.get("/my", authMiddleware, roleMiddleware("student"), getMyApplications);
router.delete("/:id/withdraw", authMiddleware, roleMiddleware("student"), withdrawApplication);
router.put("/:id/submit-work", authMiddleware, roleMiddleware("student"), submitWork);

router.get("/business", authMiddleware, roleMiddleware("business"), getBusinessApplications);
router.get("/project/:projectId", authMiddleware, roleMiddleware("business"), getApplicationsForProject);
router.put("/:id/status", authMiddleware, roleMiddleware("business"), updateApplicationStatus);
router.put("/:id/request-changes", authMiddleware, roleMiddleware("business"), requestChanges);
router.put("/:id/approve-work", authMiddleware, roleMiddleware("business"), approveWork);

// Chat history and details endpoints (accessible by both student and business, internally checked)
router.get("/:id", authMiddleware, getApplicationById);
router.get("/:id/messages", authMiddleware, getChatMessages);

module.exports = router;