import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const { setUserAndToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", form);
      setUserAndToken(res.data.token, res.data.user);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Login</h1>
        {error && <p className="error-text">{error}</p>}
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
        <button type="submit">Login</button>
        <p>
          No account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
