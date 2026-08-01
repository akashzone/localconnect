const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { accessToken, refreshToken } = require("../utils/generateToken");
const DeveloperProfile = require("../models/DeveloperProfile");
const BusinessProfile = require("../models/BusinessProfile");

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
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
      const newUserDeveloper = await DeveloperProfile.create({
        userId: newUser._id,
      });
    } else if (role == "business") {
      const newUserBusinessOwner = await BusinessProfile.create({
        userId: newUser._id,
      });
    }
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
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

    res.cookie("accessToken", accToken, cookieOptions);
    res.cookie("refreshToken", refToken, cookieOptions);
    res.status(200).json({ message: "Login successful", user });
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

module.exports = { register, login, refreshAccessToken };
