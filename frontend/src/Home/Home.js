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
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light" id="navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
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
      <div className="mt-4">
        {isAuthenticated ? (
          <SubcategoryList />
        ) : (
          <h1>Войдите или зарегистрируйтесь в системе!</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
