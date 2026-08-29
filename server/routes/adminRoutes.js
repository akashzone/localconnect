const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getAdminDashboard, getAllUsers, getUserById } = require("../controllers/adminController");

router.get("/dashboard", authMiddleware, roleMiddleware("admin"), getAdminDashboard);
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/users/:id", authMiddleware, roleMiddleware("admin"), getUserById);

module.exports = router;