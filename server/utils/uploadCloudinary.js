const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "localconnect/profile-images",
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY ERROR:", error);
          console.error("MESSAGE:", error.message);
          console.error("HTTP CODE:", error.http_code);

          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};

module.exports = uploadToCloudinary;