const express = require("express");

//controller functions
const { postReviewByBusinessOwner, getReviewByStudent, getBusinessReviews, getStudentReviews } = require("../controllers/reviewController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();


router.post("/", authMiddleware, roleMiddleware("student"), postReviewByBusinessOwner);
router.get("/business/:businessOwnerId", authMiddleware, roleMiddleware("business"), getBusinessReviews);
router.get("/student/:studentId", authMiddleware, roleMiddleware("business"), getStudentReviews);
router.get("/my", authMiddleware, roleMiddleware("student"), getReviewByStudent)

module.exports = router;