const mongoose = require("mongoose");

const businessProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      trim: true,
    },

    businessType: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "https://unsplash.com/illustrations/a-cartoon-of-a-man-giving-a-thumbs-up-dqHbENxCaVA"
    },

    logo: {
      type: String,
    },


    socialLinks: {
      website: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const BusinessProfile = mongoose.model("BusinessProfile", businessProfileSchema);

module.exports = BusinessProfile;