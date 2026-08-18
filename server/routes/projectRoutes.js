const express = require("express");

//controller functions
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getAssignedProjects,
} = require("../controllers/projectController");

//middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();


//Can be accessed only by developer
router.get("/assigned",authMiddleware,roleMiddleware("developer"),getAssignedProjects);

//Can be accessed only by businessOwner
router.post("/", authMiddleware, roleMiddleware("business"), createProject);
router.put("/:id", authMiddleware, roleMiddleware("business"), updateProject);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("business"),
  deleteProject,
);
router.get("/my", authMiddleware, roleMiddleware("business"), getMyProjects);

//Can be accesed by both of them even without login
router.get(
  "/",
  getAllProjects,
);
router.get(
  "/:id",
  getProjectById,
);

module.exports = router;
