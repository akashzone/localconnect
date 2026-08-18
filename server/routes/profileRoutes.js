const express = require("express");

//controller functions
const { getProfile, updateProfile, getDeveloperProfileById } = require("../controllers/profileController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("developer", "business"), getProfile);
router.get("/developer/:developerId", authMiddleware, roleMiddleware("business"), getDeveloperProfileById);
router.put("/", authMiddleware, roleMiddleware("developer", "business"), updateProfile);


module.exports = router;
