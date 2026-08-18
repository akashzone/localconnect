const express = require("express");

//controller functions
const { applyToProject, getMyApplications, getBusinessApplications, getApplicationsForProject, updateApplicationStatus, withdrawApplication } = require("../controllers/applicationController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("developer"), applyToProject);
router.get("/my", authMiddleware, roleMiddleware("developer"), getMyApplications);
router.delete("/:id/withdraw", authMiddleware, roleMiddleware("developer"), withdrawApplication);

router.get("/business", authMiddleware, roleMiddleware("business"), getBusinessApplications);
router.get("/project/:projectId", authMiddleware, roleMiddleware("business"), getApplicationsForProject);
router.put("/:id/status", authMiddleware, roleMiddleware("business"), updateApplicationStatus);



module.exports = router;