import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function RegisterPage() {
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
      const { data } = await api.post("/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Campus Utility</p>
        <h1>Create Account</h1>
        <p className="subtitle">Register to report lost and found items securely.</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" />
          </label>

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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
