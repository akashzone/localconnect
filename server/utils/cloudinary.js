

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// just to confirm whether the env is working or not
console.log("cloud_name :", process.env.CLOUDINARY_CLOUD_NAME);

const uploadOnCloudinary = async (localFilePath, folderName = "general", customOptions = {}) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: `my_app/${folderName}`, // Creates nested folders in Cloudinary
            resource_type: "auto",           // Handles both images and PDFs/Docs
            ...customOptions
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

module.exports = { uploadOnCloudinary };