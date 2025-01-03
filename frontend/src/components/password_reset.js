import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/password-reset/", { email });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response.data.email || "Ошибка отправки email.");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Забыли пароль?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Отправить</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
