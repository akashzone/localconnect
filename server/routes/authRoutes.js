

const express = require("express");
const router = express.Router();

const { register, login, refreshAccessToken } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

module.exports = router;