
const { uploadOnCloudinary } = require("../utils/cloudinary");
const StudentProfile = require("../models/StudentProfile");
const BusinessProfile = require("../models/BusinessProfile");

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File not found" });
        }
        const localFilePath = req.file.path;
        const response = await uploadOnCloudinary(localFilePath, "resumes");
        if (!response) {
            return res.status(400).json({ message: "Failed to upload file" });
        }
        console.log("url -", response.secure_url);

        // Save URL to StudentProfile in MongoDB
        const userId = req.user.id;
        const updatedProfile = await StudentProfile.findOneAndUpdate(
            { userId },
            { resume: response.secure_url },
            { new: true }
        );

        res.status(200).json({ 
            message: "Resume uploaded successfully", 
            response,
            profile: updatedProfile
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File not found" });
        }
        const localFilePath = req.file.path;
        const response = await uploadOnCloudinary(localFilePath, "profiles");
        console.log("Response :", response);
        if (!response) {
            return res.status(400).json({ message: "Failed to upload file" });
        }

        // Save URL to database based on role
        const userId = req.user.id;
        const role = req.user.role;
        let updatedProfile;
        if (role === "student") {
            updatedProfile = await StudentProfile.findOneAndUpdate(
                { userId },
                { profileImage: response.secure_url },
                { new: true }
            );
        } else if (role === "business") {
            updatedProfile = await BusinessProfile.findOneAndUpdate(
                { userId },
                { profileImage: response.secure_url },
                { new: true }
            );
        }

        res.status(200).json({ 
            message: "Profile image uploaded successfully", 
            response,
            profile: updatedProfile
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { uploadResume, uploadProfileImage }