import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

const initialForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Campus Utility</p>
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to manage lost and found reports on campus.</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </label>

          {error ? <p className="message error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
