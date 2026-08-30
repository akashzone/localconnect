const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getAdminDashboard, getAllUsers, getUserById } = require("../controllers/adminController");
const { getAllProjects, getProjectById } = require("../controllers/adminProjectsController");
const { getAllApplications, getApplicationById } = require("../controllers/adminApplicationsController");
const { getAllSubmissions, getSubmissionById } = require("../controllers/adminSubmissionsController");
const { getAllReviews, getReviewById } = require("../controllers/adminReviewsController");
const { getAllReports, getReportStats, getReportById, updateReportStatus } = require("../controllers/adminReportsController");

router.get("/dashboard", authMiddleware, roleMiddleware("admin"), getAdminDashboard);
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/users/:id", authMiddleware, roleMiddleware("admin"), getUserById);
router.get("/projects", authMiddleware, roleMiddleware("admin"), getAllProjects);
router.get("/projects/:id", authMiddleware, roleMiddleware("admin"), getProjectById);
router.get("/applications", authMiddleware, roleMiddleware("admin"), getAllApplications);
router.get("/applications/:id", authMiddleware, roleMiddleware("admin"), getApplicationById);
router.get("/submissions", authMiddleware, roleMiddleware("admin"), getAllSubmissions);
router.get("/submissions/:id", authMiddleware, roleMiddleware("admin"), getSubmissionById);
router.get("/reviews", authMiddleware, roleMiddleware("admin"), getAllReviews);
router.get("/reviews/:id", authMiddleware, roleMiddleware("admin"), getReviewById);

router.get("/reports", authMiddleware, roleMiddleware("admin"), getAllReports);
router.get("/reports/stats", authMiddleware, roleMiddleware("admin"), getReportStats);
router.get("/reports/:id", authMiddleware, roleMiddleware("admin"), getReportById);
router.patch("/reports/:id/status", authMiddleware, roleMiddleware("admin"), updateReportStatus);

module.exports = router;