const DeveloperProfile = require("../models/DeveloperProfile");
const BusinessProfile = require("../models/BusinessProfile");

const getProfile = async (req, res) => {
    try {
        let profile;

        if (req.user.role === "student") {
            profile = await DeveloperProfile.findOne({
                userId: req.user.id,
            });
        } else if (req.user.role === "businessOwner") {
            profile = await BusinessProfile.findOne({
                userId: req.user.id,
            });
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

module.exports = {
    getProfile,
};