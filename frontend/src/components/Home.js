import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout";

const Home = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  const handleLogout = () => {
    // Удаляем токены из localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login"); // Перенаправляем на страницу логина
  };

  return (
    <div className="container mt-5">
      <h1>Это домашняя страница</h1>
      {accessToken ? (
        <div>
          <p>Войдите в систему</p>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Пожалуйста авторизуйтесь</p>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/login")}
          >Войти
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/register")}>
            Регистрация
          </button>
          <p>You are logged in!</p>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default Home;
