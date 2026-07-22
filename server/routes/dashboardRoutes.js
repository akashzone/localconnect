
const express = require("express");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

//controller functions
const { getBusinessDashboard, getDeveloperDashboard } = require("../controllers/dashboardController")

const router = express.Router();

router.get(
    "/business",
    authMiddleware,
    roleMiddleware("business"),
    getBusinessDashboard
)

router.get(
    "/developer",
    authMiddleware,
    roleMiddleware("student"),
    getDeveloperDashboard
)

module.exports = router;