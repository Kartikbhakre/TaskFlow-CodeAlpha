const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  addMember,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProject);

router.put("/:id/members", protect, addMember);

router.delete("/:id", protect, deleteProject);

module.exports = router;