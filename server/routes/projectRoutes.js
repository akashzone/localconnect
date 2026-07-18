const express = require("express");

//controller functions
const { createProject, getAllProjects , getProjectById , updateProject, deleteProject } = require("../controllers/projectController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

//Can be accessed only by businessOwner
router.post("/", authMiddleware, roleMiddleware("business"), createProject);
router.put("/:id", authMiddleware, roleMiddleware("business"), updateProject);
router.delete("/:id", authMiddleware, roleMiddleware("business"), deleteProject);


//Can be accesed by both of them
router.get("/",authMiddleware,roleMiddleware("student","business"), getAllProjects)
router.get("/:id",authMiddleware,roleMiddleware("student","business"), getProjectById)
router

module.exports = router;
