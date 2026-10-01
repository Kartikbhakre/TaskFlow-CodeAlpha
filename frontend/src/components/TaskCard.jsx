function TaskCard({ task, onClick }) {
  return (
    <div className="task-card" onClick={() => onClick(task)}>
      <div className="task-card-top">
        <h4>{task.title}</h4>

        <span className={`priority ${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-card-bottom">
        <span>
          {task.assignedTo?.name
            ? `👤 ${task.assignedTo.name}`
            : "👤 Unassigned"}
        </span>

        {task.dueDate && (
          <span>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default TaskCard;