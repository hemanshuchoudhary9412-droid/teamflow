import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Signup = () => {
  const { setUserAndToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/signup", form);
      setUserAndToken(res.data.token, res.data.user);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Signup</h1>
        {error && <p className="error-text">{error}</p>}
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button type="submit">Create Account</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
