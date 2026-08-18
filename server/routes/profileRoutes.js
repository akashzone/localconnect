const express = require("express");

//controller functions
const { getProfile, updateProfile, getStudentProfileById } = require("../controllers/profileController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("student", "business"), getProfile);
router.get("/student/:studentId", authMiddleware, roleMiddleware("business"), getStudentProfileById);
router.put("/", authMiddleware, roleMiddleware("student", "business"), updateProfile);


module.exports = router;
