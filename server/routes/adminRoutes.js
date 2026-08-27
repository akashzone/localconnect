const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getAdminDashboard } = require("../controllers/adminController");

router.get("/dashboard", authMiddleware, roleMiddleware("admin"), getAdminDashboard);

module.exports = router;