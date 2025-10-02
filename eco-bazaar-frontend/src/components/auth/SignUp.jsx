// src/components/auth/Signup.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import "./Auth.css";

export default function Signup() {
  const [role, setRole] = useState("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: role.toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setMessage(data.message);
      setMsgType("success");
      setName(""); setEmail(""); setPassword(""); setRole("CUSTOMER");
    } catch (err) {
      setMessage(err.message);
      setMsgType("danger");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaLeaf className="eco-icon" />
          <h2>Sign Up</h2>
        </div>

        {message && (
          <div className={`alert alert-${msgType} text-center`} role="alert">
            {message}
          </div>
        )}

        <div className="role-selector">
          {["ADMIN", "SELLER", "CUSTOMER"].map((r) => (
            <button
              key={r}
              className={`role-btn ${role === r ? "active" : ""}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login" className="switch-link">Login here</Link>
        </p>
      </div>

    </div>
  );
}
