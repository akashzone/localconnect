
//controllers
const { uploadProfileImage, uploadResume } = require("../controllers/uploadController");
const upload = require("../middlewares/multerMiddleware");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const express = require("express");
const router = express.Router();

// only needed for role == student
router.post("/resume", authMiddleware, roleMiddleware("student"), upload.single("resume"), uploadResume);

//needed for both 
router.post("/profile-image", authMiddleware, roleMiddleware("student", "business"), upload.single("profileImage"), uploadProfileImage);

module.exports = router;
