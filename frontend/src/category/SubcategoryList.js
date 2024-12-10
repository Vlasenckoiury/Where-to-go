import React, { useState, useEffect } from "react";
import axios from "axios";

const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/subcategories/")
      .then((response) => {
        setSubcategories(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Ошибка при загрузке подкатегорий");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Подкатегории</h1>
      <ul>
        {subcategories.map((subcategory) => (
          <li key={subcategory.id}>
            <h3>{subcategory.name || "Без названия"}</h3>
            <p>Города: {subcategory.city.map((city) => city.name).join(", ")}</p>
            <p>Категория: {subcategory.category}</p>
            <p>Адрес: {subcategory.address}</p>
            <p>Телефон: {subcategory.phone}</p>
            <p>Время открытия: {subcategory.opening_time}</p>
            <p>Время закрытия: {subcategory.closing_time}</p>
            <p>Дни работы: {formatWorkingDays(subcategory)}</p>
          </li>
        ))}
      </ul>
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
