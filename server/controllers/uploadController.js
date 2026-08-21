
const { uploadOnCloudinary } = require("../utils/cloudinary");

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File not found" });
        }
        const localFilePath = req.file.path;
        const response = await uploadOnCloudinary(localFilePath, "resumes");
        console.log("url -", response.secure_url);
        if (!response) {
            return res.status(400).json({ message: "Failed to upload file" });
        }
        res.status(200).json({ message: "Resume uploaded successfully", response});
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
        res.status(200).json({ message: "Profile image uploaded successfully", response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { uploadResume, uploadProfileImage }