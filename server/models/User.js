const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      length: 6,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "business", "admin"],
    },
  },
  {
    timestamps: true,
  },
);


const User = mongoose.model("User",userSchema);
module.exports = User;
