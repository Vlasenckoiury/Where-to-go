import React from "react";
import "./info.css"; // Добавьте сюда стили для страницы О Нас, если нужно.

const Info = () => {
  return (
    <div className="info">
      <div className="info-container">
        <h1>О Нас</h1>
        <h2>
          Этот проект сделан в рамках стажировки
        </h2>
        <p>
          Cервис поможет вам находить лучшие места Беларуси. 
          В сервисе сделана возможность поиска мест в Беларуси по городу и категориям.
          Если вы авторизованы, то вы можете добавлять свои места.
          Добавлен Telegram Bot который так же поможет вам находить лучшие места Беларуси.
        </p>
        <h3>Наш Telegram Bot <a href="https://t.me/where_to_go_project_bot" target="_blank" rel="noopener noreferrer"><img src="images/телеграм.png" alt="telegram" className="me-2" width="100" height="60" /></a></h3>
        <p>
          <strong>Свяжитесь с нами:</strong> <a href="mailto:support@wheretogo.com">support@wheretogo.com</a>
        </p>
        <p>© 2025 Where to go. Все права защищены.</p>
      </div>
      <div className="info-button">
        <a href="/" className="btn-home">Главная</a>
      </div>
    </div>
    
  );
};

export default Info;
