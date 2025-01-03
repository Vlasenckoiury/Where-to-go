import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/password-reset/", { email });
      setMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response.data.email || "Ошибка отправки email.");
      setMessage("");
    }
  };

  return (
    <div>
      <a href="/" className="btn-home">Главная</a>
      <div className="container mt-6">
        <h2>Восстановление пароля</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Ваш email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Отправить ссылку для сброса</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
