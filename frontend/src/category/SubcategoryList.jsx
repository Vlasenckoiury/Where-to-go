import React, { useState, useEffect } from "react";
import axios from "axios";

const SubCategoryFilter = () => {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Загрузка стран при инициализации
    axios.get("http://localhost:8000/api/countries/").then((response) => {
      setCountries(response.data.results || []);
    });
    // Загрузка категорий при инициализации
    axios.get("http://localhost:8000/api/category/").then((response) => {
      setCategories(response.data.results || []);
    });
  }, []);

  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedRegion("");  // Сбросить регион при смене страны
    setSelectedCity("");  // Сбросить город при смене области
    setRegions([]);
    setCities([]);

    if (countryId) {
      axios
        .get(`http://localhost:8000/api/regions/?country=${countryId}`)
        .then((response) => {
          setRegions(response.data.results || []);
        });
    }
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedCity("");  // Сбросить город при смене области
    setCities([]);

    if (regionId) {
      axios
        .get(`http://localhost:8000/api/cities/?region=${regionId}`)
        .then((response) => {
          setCities(response.data.results || []);
        });
    }
  };

  const handleFilter = () => {
    setLoading(true);
    setError("");

    const params = {};
    if (selectedCountry) params.country = selectedCountry;
    if (selectedRegion) params.region = selectedRegion; 
    if (selectedCity) params.city = selectedCity;  
    if (selectedCategory) params.category = selectedCategory;

    axios
      .get("http://localhost:8000/api/subcategories/", { params })
      .then((response) => {
        setSubcategories(response.data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки подкатегорий");
        setLoading(false);
      });
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

  return (
    <div>
      <h2>Фильтровать подкатегории</h2>

      <div>
        <label>Страна:</label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          id="country-select"
        >
          <option value="">Выберите страну</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Область:</label>
        <select
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          disabled={!selectedCountry || regions.length === 0}
          id="region-select"
        >
          <option value="">Выберите область</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Город:</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedRegion || cities.length === 0}
          id="city-select"
        >
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Категория:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          id="category-select"
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleFilter} id="filter-button">Применить фильтры</button>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h3>Подкатегории</h3>
        <ul>
          {subcategories.map((subcategory) => (
            <li key={subcategory.id} className="subcategory-item">
            <h3>{subcategory.name || "Без названия"}</h3>
            <p>Город: {subcategory.city.name || "Не указан"}</p>
            <p>Категория: {subcategory.category.name || "Не указан"}</p>
            <p>Адрес: г.{subcategory.city.name || ""}, {subcategory.address|| "Не указан"}</p>
            <p>Телефон: {subcategory.phone || "Не указан"}</p>
            <p>Описание: {subcategory.description || "Не указано"}</p>
            <p>Время открытия: {subcategory.opening_time || "Не указано"}</p>
            <p>Время закрытия: {subcategory.closing_time || "Не указано"}</p>
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
      </div>
    </div>
  );
};

export default SubCategoryFilter;
