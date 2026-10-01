const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Project = require("../models/Project");

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const task = await Task.findById(
      req.params.taskId
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

    const comment = await Comment.create({
      text,
      task: task._id,
      author: req.userId,
    });

    const populatedComment =
      await Comment.findById(comment._id).populate(
        "author",
        "name username profileImage"
      );

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const comments =
      await Comment.find({
        task: req.params.taskId,
      })
        .populate(
          "author",
          "name username profileImage"
        )
        .sort({ createdAt: 1 });

    res.json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getComments,
};