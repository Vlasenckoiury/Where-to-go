import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SubcategoryList from "../category/SubcategoryList";
import "./Home.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Проверка аутентификации при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Функция выхода из системы
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="main-container">
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
          src="images/логотип.png"  
          alt="Logo"
          className="me-2"  // добавляем отступ справа
          width="60"  // размер логотипа
          height="60"  // размер логотипа
          />
          Where to go
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Выйти
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Войти
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Регистрация
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
    <div className="content-container">
      <div className="content">
        {isAuthenticated ? (
          <SubcategoryList />
        ) : (
          <SubcategoryList />
        )}
      </div>
    </div>
  </div>
  );
};

export default Home;
