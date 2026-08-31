

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
    register, login, logout, refreshAccessToken,
    googleLogin,
    googleCallback,
    getCurrentUser,
    logoutAllDevices
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refreshAccessToken);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout-all", authMiddleware, roleMiddleware("student", "business"), logoutAllDevices);

module.exports = router;