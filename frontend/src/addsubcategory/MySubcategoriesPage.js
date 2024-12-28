import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MySubcategoriesPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // Получение токена для авторизации

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/api/subcategories/?user_only=true', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setSubcategories(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user subcategories:', error);
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>Мои добавленные объекты</h1>
      {subcategories.length === 0 ? (
        <p>Вы еще не добавляли объекты.</p>
      ) : (
        <ul>
          {subcategories.map((subcategory) => (
            <li key={subcategory.id}>
              <h3>{subcategory.name}</h3>
              <p>{subcategory.description}</p>
              <p>Город: {subcategory.city?.name}</p>
              <p>Категория: {subcategory.category?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySubcategoriesPage;
