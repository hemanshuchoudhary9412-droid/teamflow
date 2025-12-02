import React, { createContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const setUserAndToken = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUserAndToken(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUserAndToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
