

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    register, login, refreshAccessToken,
    googleLogin,
    googleCallback,
    getCurrentUser
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;