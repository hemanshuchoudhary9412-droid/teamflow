import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Chat from "./pages/Chat.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import axios from "./api/axios.js";

const App = () => {
  const { user, setUserAndToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user) return;

    axios
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setUserAndToken(token, res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/app" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/app" replace /> : <Signup />}
      />
      <Route
        path="/app"
        element={user ? <Chat /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
