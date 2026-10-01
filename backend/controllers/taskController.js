const Task = require("../models/Task");
const Project = require("../models/Project");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    if (!title?.trim() || !projectId) {
      return res.status(400).json({
        message: "Title and project are required",
      });
    }

    const project = await Project.findById(
      projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) =>
        member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a project member",
      });
    }

    if (
      assignedTo &&
      !project.members.some(
        (member) =>
          member.toString() === assignedTo
      )
    ) {
      return res.status(400).json({
        message: "Assigned user is not a project member",
      });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      createdBy: req.userId,
      assignedTo: assignedTo || null,
      priority: priority || "medium",
      dueDate: dueDate || null,
    });

    const populatedTask = await Task.findById(
      task._id
    )
      .populate(
        "createdBy",
        "name username profileImage"
      )
      .populate(
        "assignedTo",
        "name username profileImage"
      );

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PROJECT TASKS
const getTasks = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) =>
        member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const tasks = await Task.find({
      project: req.params.projectId,
    })
      .populate(
        "createdBy",
        "name username profileImage"
      )
      .populate(
        "assignedTo",
        "name username profileImage"
      )
      .sort({ createdAt: -1 });

    res.json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(
      task.project
    );

    const isMember = project.members.some(
      (member) =>
        member.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "assignedTo",
      "dueDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    if (req.body.assignedTo) {
      const validAssignee =
        project.members.some(
          (member) =>
            member.toString() ===
            req.body.assignedTo
        );

      if (!validAssignee) {
        return res.status(400).json({
          message:
            "Assigned user is not a project member",
        });
      }
    }

    await task.save();

    const updatedTask =
      await Task.findById(task._id)
        .populate(
          "createdBy",
          "name username profileImage"
        )
        .populate(
          "assignedTo",
          "name username profileImage"
        );

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(
      task.project
    );

    if (
      project.owner.toString() !== req.userId &&
      task.createdBy.toString() !== req.userId
    ) {
      return res.status(403).json({
        message: "You cannot delete this task",
      });
    }

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};