import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
  });

  const login = (token, userData) => {
    localStorage.setItem("access_token", token); // Сохраняем токен
    localStorage.setItem("user", JSON.stringify(userData)); // Сохраняем данные пользователя
    setIsAuthenticated(true); // Обновляем состояние авторизации
    setUser(userData); // Сохраняем данные пользователя в состоянии
  };

  const logout = () => {
    localStorage.removeItem("access_token"); // Удаляем токен
    localStorage.removeItem("refresh_token"); // Удаляем refresh токен
    localStorage.removeItem("user"); // Удаляем данные пользователя
    setIsAuthenticated(false); // Обновляем состояние авторизации
    setUser(null); // Сбрасываем данные пользователя
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);