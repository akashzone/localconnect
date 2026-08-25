const express = require("express");

//controller functions
const { 
    postReviewByBusinessOwner, 
    getReviewByStudent, 
    getBusinessReviews, 
    getStudentReviews, 
    postReviewByStudent, 
    getReviewsWrittenByUser 
} = require("../controllers/reviewController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("business"), postReviewByBusinessOwner);
router.post("/student", authMiddleware, roleMiddleware("student"), postReviewByStudent);
router.get("/written", authMiddleware, getReviewsWrittenByUser);
router.get("/business/:businessOwnerId", authMiddleware, roleMiddleware("business", "student"), getBusinessReviews);
router.get("/student/:studentId", authMiddleware, roleMiddleware("business", "student"), getStudentReviews);
router.get("/my", authMiddleware, roleMiddleware("student"), getReviewByStudent);

module.exports = router;