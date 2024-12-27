import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      // Сохраняем токены в localStorage
      localStorage.setItem("access_token", response.data.access);
      
      localStorage.setItem("refresh_token", response.data.refresh);

      // Перенаправляем на домашнюю страницу
      navigate("/");
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
          <button type="submit" className="btn btn-primary">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
