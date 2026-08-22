const multer = require("multer");

const storage = multer.memoryStorage();

const uploadMiddlewware = multer({
  storage: multer.memoryStorage(),
});

module.exports = uploadMiddlewware;