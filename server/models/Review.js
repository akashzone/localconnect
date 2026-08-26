const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    businessOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessOwner"
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    reviewerRole: {
        type: String,
        enum: ["student", "business"],
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;