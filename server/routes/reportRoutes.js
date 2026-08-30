const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { createReport } = require("../controllers/reportController");

router.post("/", authMiddleware, roleMiddleware("student", "business"), createReport);

module.exports = router;
