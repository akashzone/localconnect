const multer = require("multer");
const path = require("path");

const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "./public/temp";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Generate a unique, safe filename to prevent traversal and name collisions
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "profileImage") {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid profile image format. Only JPEG, PNG, and WEBP are allowed."), false);
        }
    } else if (file.fieldname === "resume") {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid resume format. Only PDF, DOC, and DOCX are allowed."), false);
        }
    } else {
        cb(new Error("Unexpected upload field name."), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;