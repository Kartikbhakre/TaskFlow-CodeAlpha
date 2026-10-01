import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/register", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">⚡ TaskFlow</div>

        <h1>Create Account</h1>
        <p className="subtitle">
          Start managing your projects
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>

          <input
            name="name"
            placeholder="Kartik Bhakre"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Username</label>

          <input
            name="username"
            placeholder="kartik"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Create Account →
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;