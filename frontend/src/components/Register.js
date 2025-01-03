import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { SmartCaptcha } from '@yandex/smart-captcha';



const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!captchaToken) {
      setError("Пожалуйста, пройдите проверку капчи.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/register/", {
        username,
        email,
        password,
        captcha_token: captchaToken,
      });

      setSuccess("Регистрация прошла успешно!");
      setTimeout(() => navigate("/login"), 2000); // Перенаправляем на страницу логина через 2 секунды
    } catch (err) {
      setError(
        err.response?.data?.message || "Ошибка регистрации. Попробуйте ещё раз."
      );
    }
  };

  return (
    <div>
      {/* Кнопка "Главная" */}
      <a href="/" className="btn-home">Главная</a>
      <div className="container mt-5">
        <h2>Регистрация</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleRegister}>
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
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <SmartCaptcha sitekey={process.env.REACT_APP_SMARTCAPTCHA_SITEKEY} onSuccess={(token) => setCaptchaToken(token)} />
          <button type="submit" className="btn btn-primary" disabled={!captchaToken} >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
