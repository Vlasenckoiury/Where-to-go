import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SubcategoryList from "../category/SubcategoryList";
import "./Home.css";
import 'bootstrap-icons/font/bootstrap-icons.css';


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
            <div className="navbar-left">
              <Link className="info" to="/info">
                <span className="info-text">О Нас</span>
              </Link>
            </div>
            {isAuthenticated ? (
              <li className="nav-item">
                <div>
                  <Link className="addcategory" to="/addsubcategory">
                    Добавить Объект
                  </Link>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
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
      <div class="container-foot">
        <footer class="footer-container">
          <div class="footer-content">
          <div className="footer-left">
            <p>© 2025 Where to go.</p>
            <p>
              Свяжитесь с нами: <a href="mailto:support@wheretogo.com">support@wheretogo.com</a>
            </p>
            <p>Политика конфиденциальности</p>
            <Link to="/info">О Нас</Link>
          </div>
          <div className="footer-center">
            <h3>Подпишитесь на нашего Telegram Bot <a href="https://t.me/where_to_go_project_bot" target="_blank" rel="noopener noreferrer"><img src="images/телеграм.png" alt="telegram" className="me-2" width="100" height="60" /></a></h3>
          </div>
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              <a className="text-body-secondary" href="https://x.com/">
                <i className="bi bi-twitter" style={{ fontSize: '24px' }}></i>
              </a>
            </li>
            <li className="ms-3">
              <a className="text-body-secondary" href="https://www.instagram.com/">
                <i className="bi bi-instagram" style={{ fontSize: '24px' }}></i>
              </a>
            </li>
            <li className="ms-3">
              <a className="text-body-secondary" href="https://ru-ru.facebook.com/">
                <i className="bi bi-facebook" style={{ fontSize: '24px' }}></i>
              </a>
            </li>
          </ul>
          </div>
        </footer>
      </div>
    </div>
  </div>
  );
};

export default Home;
