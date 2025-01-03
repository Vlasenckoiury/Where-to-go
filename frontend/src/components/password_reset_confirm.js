import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/password-reset-confirm/", {
        uid,
        token,
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response.data || "Ошибка сброса пароля.");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Сброс пароля</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Сбросить пароль</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
