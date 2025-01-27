import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "./AuthContext"; // Импортируем useAuth

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const { login } = useAuth(); // Используем метод login из контекста

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      // Сохраняем токены в localStorage
      localStorage.setItem("access_token", response.data.access);
      
      localStorage.setItem("refresh_token", response.data.refresh);

      // Обновляем состояние авторизации
      login(response.data.access); // Передаем access token в метод login

      setSuccess("Вы успешно вошли!");
      // Перенаправляем на домашнюю страницу
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Неправильно введён логин или пароль");
    }
  };

  return (
    <div className="container">
      <div class="box-3">
        <div class="btn btn-three" onClick={() => navigate("/")}>
        <span>Вернуться на главную страницу</span>
        </div>
      </div>
      <div className="login-form">
        <h2>Войти</h2>
        {error && <div className="danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div class="forgot-password" style={{ marginTop: '50px', marginLeft: '50px' }}>
            <a href="/password_reset/">Забыли пароль?</a>
          </div>
          <button type="submit" className="btn btn-primary">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
