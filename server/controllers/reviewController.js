

const Review = require("../models/Review");


const postReviewByBusinessOwner = async (req, res) => {

    try {
        const { studentId, projectId, stars, description } = req.body;

        if (!studentId || !projectId || !stars || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Get business owner from authenticated user
        const businessOwnerId = req.user?.id;

        if (!businessOwnerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Validate MongoDB IDs
        if (
            !mongoose.Types.ObjectId.isValid(studentId) ||
            !mongoose.Types.ObjectId.isValid(projectId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student or project ID"
            });
        }

        // Find the project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Make sure this business owner owns the project
        if (project.businessOwnerId.toString() !== businessOwnerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to review this project"
            });
        }


        if (project.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "You can only review completed projects"
            });
        }

        if (
            !project.selectedDeveloper ||
            project.selectedDeveloper.toString() !== studentId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "This student was not assigned to this project"
            });
        }

        const existingReview = await Review.findOne({
            projectId,
            businessOwnerId,
            studentId
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this project"
            });
        }

        const review = await Review.create({
            studentId,
            businessOwnerId,
            projectId,
            stars,
            description
        })

        return res.status(200).json({
            success: true,
            message: "Review posted successfully",
            review
        })
    } catch (error) {
        console.log("Error in posting review =", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


const getReviewByStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const reviews = await Review.find({ studentId }).populate("businessOwnerId", "name").populate("projectId", "title");

        const totalStars = reviews.reduce(
            (sum, review) => sum + review.stars,
            0
        );

        const averageRating =
            reviews.length > 0
                ? totalStars / reviews.length
                : 0;

        return res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            reviews,
            averageRating,
            totalReviews: reviews.length
        })
    } catch (error) {
        console.log("Error in getting review by student =", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// this will be used by business to see student before accepting or rejecting the application
// it will be used in studentProfile by business
const getStudentReviews = async (req, res) => {
    try {
        const { studentId } = req.params;

        const reviews = await Review.find({ studentId })
            .populate("businessOwnerId", "name")
            .sort({ createdAt: -1 });

        const totalStars = reviews.reduce(
            (sum, review) => sum + review.stars,
            0
        );

        const averageRating =
            reviews.length > 0
                ? totalStars / reviews.length
                : 0;

        return res.status(200).json({
            success: true,
            averageRating,
            totalReviews: reviews.length,
            reviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};

const getBusinessReviews = async (req, res) => {
    try {
        const { businessOwnerId } = req.params;

        const reviews = await Review.find({ businessOwnerId })
            .populate("studentId", "name")
            .sort({ createdAt: -1 });

        const totalStars = reviews.reduce(
            (sum, review) => sum + review.stars,
            0
        );

        const averageRating =
            reviews.length > 0
                ? totalStars / reviews.length
                : 0;

        return res.status(200).json({
            success: true,
            averageRating,
            totalReviews: reviews.length,
            reviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};

const postReviewByStudent = async (req, res) => {
    try {
        const { businessOwnerId, projectId, stars, description } = req.body;

        if (!businessOwnerId || !projectId || !stars || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Get student from authenticated user
        const studentId = req.user?.id;

        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Validate MongoDB IDs
        if (
            !mongoose.Types.ObjectId.isValid(businessOwnerId) ||
            !mongoose.Types.ObjectId.isValid(projectId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid business owner or project ID"
            });
        }

        // Find the project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Make sure this student owns the project
        if (project.studentId.toString() !== studentId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to review this project"
            });
        }

        const existingReview = await Review.findOne({
            projectId,
            businessOwnerId,
            studentId
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this project"
            });
        }

        const review = await Review.create({
            studentId,
            businessOwnerId,
            projectId,
            stars,
            description
        })

        return res.status(200).json({
            success: true,
            message: "Review posted successfully",
            review
        })
    } catch (error) {
        console.log("Error in posting review by student =", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    postReviewByBusinessOwner,
    getReviewByStudent,
    postReviewByStudent,
    getStudentReviews,
    getBusinessReviews
}