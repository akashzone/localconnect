const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { accessToken, refreshToken } = require("../utils/generateToken");
const StudentProfile = require("../models/StudentProfile");
const BusinessProfile = require("../models/BusinessProfile");
const googleClient = require("../config/google");


const googleLogin = (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile"
    ]
  });

  res.redirect(url);
};
const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("Got the code :", code);
    if (!code) {
      return res.status(400).json({
        message: "Google authorization code missing",
      });
    }

    // Exchange authorization code for Google tokens
    const { tokens } = await googleClient.getToken(code);

    // Get Google user information
    googleClient.setCredentials(tokens);

    const { data } = await googleClient.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const {
      id: googleId,
      email,
      name,
    } = data;

    if (!googleId || !email) {
      return res.status(400).json({
        message: "Unable to get Google account information",
      });
    }

    // Check whether Google account already exists
    let user = await User.findOne({ googleId });

    // If Google account doesn't exist,
    // check whether the email already exists
    if (!user) {
      user = await User.findOne({ email });
    }

    // Existing LocalConnect user
    if (user) {

      // Link Google account if it hasn't been linked yet
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

    } else {

      // Google account is not registered in LocalConnect
      return res.redirect(
        (process.env.FRONTEND_URL || "http://localhost:5173") + "/login?error=google_not_registered"
      );
    }

    // Generate YOUR LocalConnect JWTs
    const accToken = accessToken(user);
    const refToken = refreshToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // Access token - 15 minutes
    res.cookie("accessToken", accToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    // Refresh token - 7 days
    res.cookie("refreshToken", refToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("User Logged in with Google ID:", user._id);
    // Redirect back to React
    res.redirect((process.env.FRONTEND_URL || "http://localhost:5173") + "/oauth-success");
  } catch (error) {
    console.error("Google OAuth Error:", error);

    return res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Email, password, and name are required.",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    if (!["student", "business"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    if (role == "student") {
      const newUserDeveloper = await StudentProfile.create({
        userId: newUser._id,
      });
    } else if (role == "business") {
      const newUserBusinessOwner = await BusinessProfile.create({
        userId: newUser._id,
      });
    }
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const trimmedEmail = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  try {
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accToken = accessToken(user);
    const refToken = refreshToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };


    res.cookie("accessToken", accToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    res.status(200).json({ message: "Login successful", user: userResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newAccessToken = accessToken({
      _id: decoded.id,
      role: decoded.role,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("accessToken", newAccessToken, cookieOptions);

    res.json({
      message: "Access token refreshed",
    });
  } catch (err) {
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get Current User Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

module.exports = {
  register, login, logout, refreshAccessToken, googleLogin,
  googleCallback, getCurrentUser
};
