const express = require("express");

//controller functions
const { applyToProject, getMyApplications, getBusinessApplications, getApplicationsForProject, updateApplicationStatus, withdrawApplication, submitWork } = require("../controllers/applicationController");

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



module.exports = router;