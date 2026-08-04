const User = require("../models/User");
const DeveloperProfile = require("../models/DeveloperProfile");
const BusinessProfile = require("../models/BusinessProfile");

const getProfile = async (req, res) => {
    try {
        let profile;
        if (req.user.role === "student") {
            profile = await DeveloperProfile.findOne({
                userId: req.user.id,
            }).populate("userId", "name email role");
        } else if (req.user.role === "business") {
            profile = await BusinessProfile.findOne({
                userId: req.user.id,
            }).populate("userId", "name email role");
        } else {
            return res.status(400).json({
                message: "Invalid user role",
            });
        }

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            profile,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const { bio, businessName, businessType, address, phone, description, socialLinks, github, linkedIn, portfolio, skills } = req.body;
        let profile;

        if (req.user.role === "student") {
            let skillsArray = undefined;
            if (skills !== undefined) {
                if (Array.isArray(skills)) {
                    skillsArray = skills.map(s => s.trim());
                } else if (typeof skills === "string") {
                    skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
                }
            }

            const updateData = { bio, github, linkedIn, portfolio };
            if (skillsArray !== undefined) {
                updateData.skills = skillsArray;
            }

            profile = await DeveloperProfile.findOneAndUpdate(
                { userId: req.user.id },
                updateData,
                { new: true }
            ).populate("userId", "name email role");
        } else if (req.user.role === "business") {
            profile = await BusinessProfile.findOneAndUpdate(
                { userId: req.user.id },
                {
                    businessName,
                    businessType,
                    address,
                    phone,
                    description,
                    socialLinks: {
                        ...socialLinks
                    }
                },
                { new: true }
            ).populate("userId", "name email role");
        } else {
            return res.status(400).json({
                message: "Invalid user role",
            });
        }

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
};