import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токены из localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Перенаправляем на страницу логина
    navigate("/login");
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
