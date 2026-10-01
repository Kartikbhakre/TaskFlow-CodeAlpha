function ProjectCard({ project, selected, onClick }) {
  return (
    <div
      className={`project-card ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="project-icon">
        📁
      </div>

      <div>
        <h3>{project.name}</h3>

        <p>
          {project.description || "No description"}
        </p>

        <span>
          👥 {project.members?.length || 0} members
        </span>
      </div>
    </div>
  );
}

export default ProjectCard;