const Project = require("../models/Project");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.userId,
      members: [req.userId],
    });

    const populatedProject = await Project.findById(
      project._id
    ).populate(
      "owner members",
      "name username email profileImage"
    );

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.userId },
        { members: req.userId },
      ],
    })
      .populate(
        "owner members",
        "name username email profileImage"
      )
      .sort({ createdAt: -1 });

    res.json({
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PROJECT
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    ).populate(
      "owner members",
      "name username email profileImage"
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember =
      project.members.some(
        (member) =>
          member._id.toString() === req.userId
      );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json({
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD MEMBER
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.owner.toString() !== req.userId
    ) {
      return res.status(403).json({
        message: "Only project owner can add members",
      });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({
        message: "User is already a member",
      });
    }

    project.members.push(userId);

    await project.save();

    const updatedProject =
      await Project.findById(project._id).populate(
        "owner members",
        "name username email profileImage"
      );

    res.json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.owner.toString() !== req.userId
    ) {
      return res.status(403).json({
        message: "Only project owner can delete project",
      });
    }

    await Project.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  addMember,
  deleteProject,
};