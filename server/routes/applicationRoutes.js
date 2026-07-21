const express = require("express");

//controller functions
const { applyToProject,getMyApplications, getApplicationsForProject } = require("../controllers/applicationController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/",authMiddleware,roleMiddleware("student"),applyToProject);
router.get("/my",authMiddleware,roleMiddleware("student"),getMyApplications);
router.get("/project/:projectId",authMiddleware,roleMiddleware("business"),getApplicationsForProject);

module.exports = router;