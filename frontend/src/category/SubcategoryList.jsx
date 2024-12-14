import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubcategoryList.css";

const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

  useEffect(() => {
    fetchSubcategories(currentPage);
  }, [currentPage]);

  const fetchSubcategories = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/subcategories/?page=${page}`
      );
      setSubcategories(response.data.results); // Устанавливаем данные для текущей страницы
      setTotalPages(response.data.count / response.data.page_size); // Рассчитываем количество страниц
      setLoading(false);
    } catch (err) {
      setError("Ошибка при загрузке подкатегорий");
      setLoading(false);
    }
  };

  
  const handleNextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1); // Переход на следующую страницу
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Переход на предыдущую страницу
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year} г.`; // Возвращаем дату в формате "день.месяц.год г."
  };

  const formatWorkingDays = (subcategory) => {
  const days = [
    { label: "Понедельник", key: "is_monday" },
    { label: "Вторник", key: "is_tuesday" },
    { label: "Среда", key: "is_wednesday" },
    { label: "Четверг", key: "is_thursday" },
    { label: "Пятница", key: "is_friday" },
    { label: "Суббота", key: "is_saturday" },
    { label: "Воскресенье", key: "is_sunday" },
  ];

    return days
      .filter((day) => subcategory[day.key])
      .map((day) => day.label)
      .join(", ") || "Не указано";
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="subcategory-list-container">
      <ul className="subcategory-list">
        {subcategories.map((subcategory) => (
          <li key={subcategory.id} className="subcategory-item">
            <h3>{subcategory.name || "Без названия"}</h3>
            <p>Город: {subcategory.city.name || "Не указан"}</p>
            <p>Категория: {subcategory.category.name || "Не указан"}</p>
            <p>Адрес: {subcategory.address}</p>
            <p>Телефон: {subcategory.phone}</p>
            <p>Описание: {subcategory.description}</p>
            <p>Время открытия: {subcategory.opening_time}</p>
            <p>Время закрытия: {subcategory.closing_time}</p>
            <p>
              {subcategory.specific_date ? (
                <>Дата: {formatDate(subcategory.specific_date)}</>
              ) : (
                <>Дни работы: {formatWorkingDays(subcategory)}</>
              )}
            </p>
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      <div className="pagination-container">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1} // Отключаем кнопку на первой странице
          className="pagination-button"
        >
          Предыдущая
        </button>
        <span className="pagination-info">
          Страница {currentPage} из {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages} // Отключаем кнопку на последней странице
          className="pagination-button"
        >
          Следующая
        </button>
      </div>
    </div>
  );
};

export default SubcategoryList;
