import { useEffect, useState } from "react";
import api from "../api";

function TaskModal({
  task,
  users,
  onClose,
  onUpdated,
  onDeleted,
}) {
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "medium",
    assignedTo: task.assignedTo?._id || "",
    dueDate: task.dueDate
      ? task.dueDate.substring(0, 10)
      : "",
  });

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadComments();
  }, [task._id]);

  const loadComments = async () => {
    try {
      const res = await api.get(`/comments/${task._id}`);
      setComments(res.data.comments || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.put(`/tasks/${task._id}`, {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        assignedTo: form.assignedTo || null,
        dueDate: form.dueDate || null,
      });

      onUpdated(res.data.task);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await api.delete(`/tasks/${task._id}`);

      onDeleted(task._id);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      );
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);

      const res = await api.post(
        `/comments/${task._id}`,
        {
          text: commentText,
        }
      );

      setComments((prev) => [
        ...prev,
        res.data.comment,
      ]);

      setCommentText("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="task-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="modal-header">
          <div>
            <span className="modal-label">
              TASK DETAILS
            </span>

            <h2>{task.title}</h2>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        {/* Main Form */}

        <form onSubmit={handleUpdate}>
          <div className="modal-grid">

            {/* Title */}

            <div className="form-group full-width">
              <label>Task Title</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}

            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe this task..."
              />
            </div>

            {/* Status */}

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="todo">
                  Todo
                </option>

                <option value="progress">
                  In Progress
                </option>

                <option value="done">
                  Done
                </option>
              </select>
            </div>

            {/* Priority */}

            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

            {/* Assignment */}

            <div className="form-group">
              <label>Assign To</label>

              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
              >
                <option value="">
                  Unassigned
                </option>

                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name} (@{user.username})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}

            <div className="form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}

          <div className="modal-actions">
            <button
              type="button"
              className="danger-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              🗑 Delete Task
            </button>

            <div className="modal-right-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {/* Comments */}

        <div className="comments-section">

          <div className="comments-heading">
            <h3>Comments</h3>

            <span>
              {comments.length}
            </span>
          </div>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">
                No comments yet. Start the conversation.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  className="comment"
                  key={comment._id}
                >
                  <div className="comment-avatar">
                    {comment.author?.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div className="comment-content">
                    <div className="comment-top">
                      <strong>
                        {comment.author?.name ||
                          "User"}
                      </strong>

                      <span>
                        {new Date(
                          comment.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p>{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            className="comment-form"
            onSubmit={handleAddComment}
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
            />

            <button
              type="submit"
              disabled={commentLoading}
            >
              {commentLoading
                ? "..."
                : "Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;