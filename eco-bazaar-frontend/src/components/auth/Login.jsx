import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: role.toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      // Redirect to role-based dashboard
      switch (data.role) {
        case "admin":
          navigate("/admin");
          break;
        case "seller":
          navigate("/seller");
          break;
        case "customer":
          navigate("/customer");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaLeaf className="eco-icon" />
          <h2>Login</h2>
        </div>

        <div className="role-selector mb-3">
          {["ADMIN", "SELLER", "CUSTOMER"].map((r) => (
            <button
              key={r}
              type="button"
              className={`role-btn ${role === r ? "active" : ""}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="submit-btn btn btn-success w-100 mt-3">Login</button>
        </form>

        <p className="switch-text mt-3">
          Don’t have an account? <Link to="/signup" className="switch-link">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
