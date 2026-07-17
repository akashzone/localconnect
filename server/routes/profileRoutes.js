const express = require("express");

//controller functions
const { getProfile } = require("../controllers/profileController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("student","businessOwner"), getProfile);

module.exports = router;
