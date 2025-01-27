import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import { FaHeart } from "react-icons/fa";
import SubCategoryFilter from "../category/SubcategoryList";
import { useAuth } from "../components/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    // Загружаем избранное из localStorage при первом рендере
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Проверка аутентификации при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Состояние авторизации уже управляется через AuthContext
    }
  }, []);

  // Функция выхода из системы
  const handleLogout = () => {
    logout(); // Используем метод logout из контекста
    navigate("/login");
  };

  const handleFavoriteClick = (subcategory) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;

      if (prevFavorites.some((fav) => fav.id === subcategory.id)) {
        // Удаляем элемент из избранного
        updatedFavorites = prevFavorites.filter(
          (fav) => fav.id !== subcategory.id
        );
      } else {
        // Добавляем элемент в избранное
        updatedFavorites = [...prevFavorites, subcategory];
      }

      // Сохраняем обновленный список в localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };

  const handleOpenFavoritesModal = () => {
    setIsFavoritesModalOpen(true);
  };

  const handleCloseFavoritesModal = (e) => {
    setIsFavoritesModalOpen(false); 
  };

  const removeFavorite = (subcategory) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== subcategory.id));
  };

  return (
    <div className="main-container">
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        id="navbar"
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="images/логотип.png"
              alt="Logo"
              className="me-2" // добавляем отступ справа
              width="60" // размер логотипа
              height="60" // размер логотипа
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
                  <div className="welcome-message">
                    Добро пожаловать, {user?.username}!
                  </div>
                  <div className="favorites-link-container">
                    <button onClick={handleOpenFavoritesModal} className="favorites-link-button">
                      <p className="favorites-link">Избранное</p>
                      <FaHeart size={27} color="red" />
                      <span className="favorites-count">{favorites.length}</span>
                    </button>
                    {/* Модальное окно для избранных */}
                    {isFavoritesModalOpen && (
                      <div className="modal-overlay-favorites" onClick={handleCloseFavoritesModal}>
                        <div className="modal-content-favorites" onClick={(e) => e.stopPropagation()}>
                          <div className="modal-header">
                            <h2 className="favorites-title">Избранное</h2>
                            <button className="modal-close" onClick={handleCloseFavoritesModal}>✖</button>
                          </div>
                          <div className="favorites-list">
                            {favorites.length === 0 ? (
                              <p>Нет избранных карточек</p>
                            ) : (
                              favorites.map((fav) => (
                                <div key={fav.id} className="favorite-item">
                                  <img
                                    src={fav.image || "/images/нет фото.jpg"}
                                    alt={fav.name}
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      borderRadius: "10px",
                                      objectFit: "contain",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <div>
                                    <h3>{fav.name || "Без названия"}</h3>
                                    <p>Адрес: г.{fav.city?.name || "Не указан"}, {fav.address}</p>
                                    <button
                                      onClick={() => removeFavorite(fav)}
                                      style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#f44336",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Удалить из избранного
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
                  <div className="favorites-link-container">
                    <button onClick={handleOpenFavoritesModal} className="favorites-link-button">
                      <p className="favorites-link">Избранное</p>
                      <FaHeart size={27} color="red" />
                      <span>{favorites.length}</span>
                    </button>
                  </div>
                  <li className="nav-login">
                    <Link className="nav-link-login" to="/login">
                      Войти
                    </Link>
                  </li>
                  <li className="nav-register">
                    <Link className="nav-link-register" to="/register">
                      Регистрация
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Модальное окно для избранных
      {isFavoritesModalOpen && (
        <div className="modal-overlay-favorites" onClick={handleCloseFavoritesModal}>
          <div className="modal-content-favorites" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseFavoritesModal}>
              ✖
            </button>
            <h2>Избранное</h2>
            <div className="favorites-list">
              {favorites.length === 0 ? (
                <p>Нет избранных карточек</p>
              ) : (
                favorites.map((fav) => (
                  <div key={fav.id} className="favorite-item">
                    <img
                      src={fav.image || "/images/нет фото.jpg"}
                      alt={fav.name}
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "10px",
                        objectFit: "contain",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <h3>{fav.name || "Без названия"}</h3>
                      <p>Город: г.{fav.city?.name || "Не указан"}</p>
                      <button
                        onClick={() => removeFavorite(fav)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#f44336",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Удалить из избранного
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}     */}
      <div className="content-container">
        <div className="content">
          {/* Передаем toggleFavorite, favorite в SubCategoryFilter */}
          <SubCategoryFilter
            favorites={favorites}  // Передаем список избранных элементов
            toggleFavorite={handleFavoriteClick}
          />
        </div>
        <div class="container-foot">
          <footer class="footer-container">
            <div class="footer-content">
              <div className="footer-left">
                <p>© 2025 Where to go.</p>
                <p>
                  Свяжитесь с нами:{" "}
                  <a href="mailto:support@wheretogo.com">
                    support@wheretogo.com
                  </a>
                </p>
                <p>Политика конфиденциальности</p>
                <Link to="/info">О Нас</Link>
              </div>
              <div className="footer-center">
                <h3>
                  Подпишитесь на нашего Telegram Bot{" "}
                  <a
                    href="https://t.me/where_to_go_project_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="images/телеграм.png"
                      alt="telegram"
                      className="me-2"
                      width="100"
                      height="60"
                    />
                  </a>
                </h3>
              </div>
              <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li className="ms-3">
                  <a className="text-body-secondary" href="https://x.com/">
                    <i
                      className="bi bi-twitter"
                      style={{ fontSize: "24px" }}
                    ></i>
                  </a>
                </li>
                <li className="ms-3">
                  <a
                    className="text-body-secondary"
                    href="https://www.instagram.com/"
                  >
                    <i
                      className="bi bi-instagram"
                      style={{ fontSize: "24px" }}
                    ></i>
                  </a>
                </li>
                <li className="ms-3">
                  <a
                    className="text-body-secondary"
                    href="https://ru-ru.facebook.com/"
                  >
                    <i
                      className="bi bi-facebook"
                      style={{ fontSize: "24px" }}
                    ></i>
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
