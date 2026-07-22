
const express = require("express");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

//controller functions
const { getBusinessDashboard } = require("../controllers/dashboardController")

const router = express.Router();


router.get(
    "/business",
    authMiddleware,
    roleMiddleware("business"),
    getBusinessDashboard
)

module.exports = router;