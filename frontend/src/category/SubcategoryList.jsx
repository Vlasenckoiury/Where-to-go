import React, { useState, useEffect } from "react";
import axios from "axios";

const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    // Получаем данные с первой страницы
    fetchData("http://localhost:8000/api/subcategories/?page=1");
  }, []);

  const fetchData = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setSubcategories(response.data.results);  // Сохраняем данные
      setNextPage(response.data.next);  // Устанавливаем URL для следующей страницы
      setPreviousPage(response.data.previous);  // Устанавливаем URL для предыдущей страницы
      setLoading(false);
    } catch (err) {
      setError("Ошибка при загрузке подкатегорий");
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchData(nextPage); // Переход на следующую страницу
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchData(previousPage); // Переход на предыдущую страницу
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Подкатегории</h1>
      <ul>
        {subcategories.map((subcategory) => (
          <li key={subcategory.id}>
            <h3>{subcategory.name || "Без названия"}</h3>
            <p>
              Города:{" "}
              {subcategory.city.length > 0
                ? subcategory.city.map((city) => city.name).join(", ")
                : "Все города"}
            </p>
            <p>Категория: {subcategory.category.name}</p>
            <p>Адрес: {subcategory.address}</p>
            <p>Телефон: {subcategory.phone}</p>
            <p>Описание: {subcategory.description}</p>
            <p>Время открытия: {subcategory.opening_time}</p>
            <p>Время закрытия: {subcategory.closing_time}</p>
            <p>Обед с: {subcategory.lunch_start} До: {subcategory.lunch_end}</p>
            <p>Дни работы: {formatWorkingDays(subcategory)}</p>
          </li>
        ))}
      </ul>
      
      <div>
        {previousPage && <button onClick={handlePreviousPage}>Предыдущая</button>}
        {nextPage && <button onClick={handleNextPage}>Следующая</button>}
      </div>
    </div>
  );
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

export default SubcategoryList;
