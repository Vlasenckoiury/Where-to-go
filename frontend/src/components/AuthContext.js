// AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken") // Проверяем, есть ли токен в localStorage
  );

  const login = (token) => {
    localStorage.setItem("accessToken", token); // Сохраняем токен
    setIsAuthenticated(true); // Обновляем состояние авторизации
  };

  const logout = () => {
    localStorage.removeItem("accessToken"); // Удаляем токен
    setIsAuthenticated(false); // Обновляем состояние авторизации
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);