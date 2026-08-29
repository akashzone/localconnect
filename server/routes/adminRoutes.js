const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getAdminDashboard, getAllUsers, getUserById } = require("../controllers/adminController");
const { getAllProjects, getProjectById } = require("../controllers/adminProjectsController");

router.get("/dashboard", authMiddleware, roleMiddleware("admin"), getAdminDashboard);
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/users/:id", authMiddleware, roleMiddleware("admin"), getUserById);
router.get("/projects", authMiddleware, roleMiddleware("admin"), getAllProjects);
router.get("/projects/:id", authMiddleware, roleMiddleware("admin"), getProjectById);

module.exports = router;