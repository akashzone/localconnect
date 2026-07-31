const express = require("express");

//controller functions
const { getProfile, updateProfile } = require("../controllers/profileController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("student", "business"), getProfile);
router.put("/", authMiddleware, roleMiddleware("student", "business"), updateProfile);

module.exports = router;
