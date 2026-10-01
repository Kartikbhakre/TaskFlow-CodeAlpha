import { useEffect, useState } from "react";
import api from "../api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] =
    useState(null);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [activeTask, setActiveTask] =
    useState(null);

  const [projectName, setProjectName] =
    useState("");

  const [projectDescription, setProjectDescription] =
    useState("");

  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskDescription, setTaskDescription] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // -------------------------
  // GET PROJECTS
  // -------------------------

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");

      setProjects(res.data.projects || []);

      if (res.data.projects?.length > 0) {
        selectProject(res.data.projects[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // GET USERS
  // -------------------------

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");

      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // SELECT PROJECT
  // -------------------------

  const selectProject = async (project) => {
    try {
      setSelectedProject(project);

      const res = await api.get(
        `/tasks/project/${project._id}`
      );

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // CREATE PROJECT
  // -------------------------

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/projects", {
        name: projectName,
        description: projectDescription,
      });

      setProjects((prev) => [
        res.data.project,
        ...prev,
      ]);

      setProjectName("");
      setProjectDescription("");

      selectProject(res.data.project);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CREATE TASK
  // -------------------------

  const createTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim() || !selectedProject)
      return;

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/tasks", {
        title: taskTitle,
        description: taskDescription,
        projectId: selectedProject._id,
        priority: "medium",
      });

      setTasks((prev) => [
        res.data.task,
        ...prev,
      ]);

      setTaskTitle("");
      setTaskDescription("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // TASK UPDATED
  // -------------------------

  const handleTaskUpdated = async (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );

    setActiveTask(updatedTask);

    // Refresh tasks so populated data stays correct
    if (selectedProject) {
      try {
        const res = await api.get(
          `/tasks/project/${selectedProject._id}`
        );

        setTasks(res.data.tasks || []);

        const freshTask = res.data.tasks?.find(
          (task) => task._id === updatedTask._id
        );

        if (freshTask) {
          setActiveTask(freshTask);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // -------------------------
  // TASK DELETED
  // -------------------------

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) =>
      prev.filter((task) => task._id !== taskId)
    );

    setActiveTask(null);
  };

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  );

  return (
    <div className="app">
      <Navbar />

      <main className="dashboard">

        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* PAGE HEADER */}

        <div className="page-header">
          <div>
            <p className="eyebrow">
              WORKSPACE
            </p>

            <h1>Projects</h1>

            <p className="page-subtitle">
              Organize your work and keep your
              team moving.
            </p>
          </div>

          <form
            className="project-form"
            onSubmit={createProject}
          >
            <input
              type="text"
              placeholder="New project name"
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Description"
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              className="green-btn"
              disabled={loading}
            >
              + Create Project
            </button>
          </form>
        </div>

        {/* PROJECT LIST */}

        <section className="projects-section">

          <div className="section-heading">
            <h2>Your Projects</h2>

            <span>
              {projects.length} projects
            </span>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                selected={
                  selectedProject?._id ===
                  project._id
                }
                onClick={() =>
                  selectProject(project)
                }
              />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="empty-state">
              <div>📁</div>

              <h3>No projects yet</h3>

              <p>
                Create your first project to
                get started.
              </p>
            </div>
          )}
        </section>

        {/* SELECTED PROJECT */}

        {selectedProject && (
          <section className="board-section">

            <div className="board-header">
              <div>
                <p className="eyebrow">
                  SELECTED PROJECT
                </p>

                <h2>
                  {selectedProject.name}
                </h2>

                <p>
                  {selectedProject.description ||
                    "No project description"}
                </p>
              </div>

              <div className="task-count">
                {tasks.length} tasks
              </div>
            </div>

            {/* ADD TASK */}

            <form
              className="task-form"
              onSubmit={createTask}
            >
              <input
                type="text"
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Task description"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(
                    e.target.value
                  )
                }
              />

              <button
                type="submit"
                className="blue-btn"
                disabled={loading}
              >
                + Add Task
              </button>
            </form>

            {/* KANBAN BOARD */}

            <div className="kanban-board">

              {/* TODO */}

              <div className="kanban-column">
                <div className="column-header">
                  <div>
                    <span className="column-dot todo-dot"></span>

                    <h3>Todo</h3>
                  </div>

                  <span>
                    {todoTasks.length}
                  </span>
                </div>

                <div className="task-list">
                  {todoTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={setActiveTask}
                    />
                  ))}
                </div>
              </div>

              {/* PROGRESS */}

              <div className="kanban-column">
                <div className="column-header">
                  <div>
                    <span className="column-dot progress-dot"></span>

                    <h3>In Progress</h3>
                  </div>

                  <span>
                    {progressTasks.length}
                  </span>
                </div>

                <div className="task-list">
                  {progressTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={setActiveTask}
                    />
                  ))}
                </div>
              </div>

              {/* DONE */}

              <div className="kanban-column">
                <div className="column-header">
                  <div>
                    <span className="column-dot done-dot"></span>

                    <h3>Done</h3>
                  </div>

                  <span>
                    {doneTasks.length}
                  </span>
                </div>

                <div className="task-list">
                  {doneTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onClick={setActiveTask}
                    />
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}
      </main>

      {/* TASK MODAL */}

      {activeTask && (
        <TaskModal
          task={activeTask}
          users={users}
          onClose={() =>
            setActiveTask(null)
          }
          onUpdated={handleTaskUpdated}
          onDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
}

export default Dashboard;