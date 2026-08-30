const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getAdminDashboard, getAllUsers, getUserById } = require("../controllers/adminController");
const { getAllProjects, getProjectById } = require("../controllers/adminProjectsController");
const { getAllApplications, getApplicationById } = require("../controllers/adminApplicationsController");
const { getAllSubmissions, getSubmissionById } = require("../controllers/adminSubmissionsController");
const { getAllReviews, getReviewById } = require("../controllers/adminReviewsController");

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

module.exports = router;