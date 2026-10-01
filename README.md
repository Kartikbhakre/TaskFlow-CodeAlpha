# TaskFlow – Project Management Tool

TaskFlow is a full-stack project management application built as part of the CodeAlpha Full Stack Development Internship.

It allows users to create projects, manage tasks using a Kanban board, assign tasks, set priorities and due dates, and communicate through task comments.

## 🚀 Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected API routes
- Secure password hashing with bcrypt

### Project Management
- Create projects
- View projects
- Select and manage projects
- Project members support

### Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to users
- Set task priority
- Set due dates
- Change task status

### Kanban Board
Tasks are organized into:

- Todo
- In Progress
- Done

### Comments
- Add comments to tasks
- View task comments
- Display comment author and timestamp

### UI
- Responsive dark interface
- Project dashboard
- Task cards
- Task details modal
- Responsive layout for smaller screens

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### Deployment
- Render
- MongoDB Atlas

---

## 📁 Project Structure

```text
TaskFlow/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── commentRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProjectCard.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   │
    │   ├── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── .env
    ├── .gitignore
    ├── package.json
    └── vite.config.js
