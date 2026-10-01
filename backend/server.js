const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running 🚀",
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TaskFlow server running on port ${PORT}`);
});