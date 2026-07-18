const express = require("express");

//controller functions
const { createProject, getAllProjects , getProjectById } = require("../controllers/projectController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("business"), createProject);
router.get("/",authMiddleware,roleMiddleware("student","business"), getAllProjects)
router.get("/:id",authMiddleware,roleMiddleware("student","business"), getProjectById)

module.exports = router;
