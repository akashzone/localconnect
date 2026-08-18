
const express = require("express");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

//controller functions
const { getBusinessDashboard, getStudentDashboard } = require("../controllers/dashboardController")

const router = express.Router();

router.get(
    "/business",
    authMiddleware,
    roleMiddleware("business"),
    getBusinessDashboard
)

router.get(
    "/student",
    authMiddleware,
    roleMiddleware("student"),
    getStudentDashboard
)

module.exports = router;