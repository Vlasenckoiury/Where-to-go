import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubcategoryList.css";

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
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalCount, setTotalCount] = useState("");
  
  useEffect(() => {
    // Загрузка стран при инициализации
    axios
      .get("http://localhost:8000/api/countries/")
      .then((response) => {
        setCountries(response.data.results || []);
      })
      .catch((error) => {
        console.error("Ошибка загрузки стран", error);
      });
    // Загрузка категорий при инициализации
    axios
      .get("http://localhost:8000/api/category/?no_paginate=true")
      .then((response) => {
        setCategories(response.data.results || response.data || []);
      })
      .catch((error) => {
        console.error("Ошибка загрузки категорий", error);
      });
  }, []);

  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedRegion(""); // Сбросить регион при смене страны
    setSelectedCity(""); // Сбросить город при смене области
    setRegions([]);
    setCities([]);

    if (countryId) {
      axios
        .get(
          `http://localhost:8000/api/regions/?country=${countryId}&no_paginate=true`
        )
        .then((response) => {
          setRegions(response.data || []);
        });
    }
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedCity(""); // Сбросить город при смене области
    setCities([]);
    if (regionId) {
      axios
        .get(
          `http://localhost:8000/api/cities/?region=${regionId}&no_paginate=true`
        )
        .then((response) => {
          setCities(response.data || []);
        });
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSubcategories([]); // Очищаем подкатегории при смене категории

    if (categoryId) {
      // Если категория выбрана, загружаем соответствующие подкатегории
      axios
        .get(
          `http://localhost:8000/api/category/?category=${categoryId}&no_paginate=true`
        )
        .then((response) => {
          setCategories(response.data || []);
        })
        .catch((error) => {
          console.error("Ошибка загрузки категорий", error);
        });
    } else {
      // Если категория сброшена, загружаем все категории
      axios
        .get("http://localhost:8000/api/category/?no_paginate=true")
        .then((response) => {
          setCategories(response.data || []);
        })
        .catch((error) => {
          console.error("Ошибка загрузки категорий", error);
        });
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    setError("");
  
    const params = {};
    if (selectedCountry) params.country = selectedCountry;
    if (selectedRegion) params.region = selectedRegion;
    if (selectedCity) params.city = selectedCity;
    if (selectedCategory) params.category = selectedCategory;
  
    try {
      const response = await axios.get("http://localhost:8000/api/subcategories/", { params });
      processFilterResult(response.data); // Передаем результат в обработчик
    } catch (error) {
      setError("Ошибка загрузки объектов");
      console.error("Ошибка фильтрации:", error);
    } finally {
      setLoading(false);
    }
  };

  const processFilterResult = (data) => {
    setSubcategories(data.results || []); // Обновляем список подкатегорий
    setNextPage(data.next || null); // Сохраняем ссылку на следующую страницу
    setPrevPage(data.previous || null); // Сохраняем ссылку на предыдущую страницу

    if (data.count && data.count > 0) {
      setTotalCount(`Всего найдено: ${data.count} объектов`);
    } else {
      setTotalCount("Ничего не найдено");
    }
  };
  
  const handleNextPage = () => {
    if (nextPage) {
      axios
        .get(nextPage)
        .then((response) => processFilterResult(response.data))
        .catch((error) => {
          setError("Ошибка загрузки следующей страницы");
          console.error("Ошибка пагинации (следующая страница):", error);
        });
    }
  };
  
  const handlePrevPage = () => {
    if (prevPage) {
      axios
        .get(prevPage)
        .then((response) => processFilterResult(response.data))
        .catch((error) => {
          setError("Ошибка загрузки предыдущей страницы");
          console.error("Ошибка пагинации (предыдущая страница):", error);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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

    return (
      days
        .filter((day) => subcategory[day.key])
        .map((day) => day.label)
        .join(", ") || "Не указано"
    );
  };

  return (
    <div className="container">
      <div className="filter-section">
        <h2>Куда идём?</h2>
        <div className="form-group">
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
        <div className="form-group">
          <label>Область:</label>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">Выберите область</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
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
        <div className="form-group">
          <label>Категория:</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
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
        <button onClick={handleFilter} className="filter-button">
          Применить фильтры
        </button>
        {loading && <p>Загрузка...</p>}
        {error && <p className="error-text">{error}</p>}
        <p>{totalCount}</p>
      </div>
      <div className="results-section">
      <h3>
        Выбирай куда идём сегодня
        <img
          src="/images/go-new.jpg" // Укажите путь к картинке
          alt="small-icon"
          style={{
            width: '120px', // Размер картинки (можно настроить)
            height: '50px',
            verticalAlign: 'middle', // Выравнивание картинки по вертикали с текстом
            marginRight: '10px', // Отступ между картинкой и текстом
          }}
        />
      </h3>
        <ul className="subcategory-list">
          {subcategories.map((subcategory) => (
            <li key={subcategory.id} className="subcategory-item">
              <h3>{subcategory.name || "Без названия"}</h3>
              <p>🏙 Город:  {subcategory.city.name || "Не указан"}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i class="bi bi-border-width"style={{ marginRight: '10px' }}></i>
                <p>Категория:  {subcategory.category.name || "Не указан"}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i class="bi bi-geo-alt-fill"style={{ marginRight: '10px' }}></i>
                <p>Адрес:  {subcategory.address || "Не указан"}</p> 
              </div>  
              <p> 📞 Телефон:  {subcategory.phone || "Не указан"}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-clipboard-fill" style={{ marginRight: '10px' }}></i>
                <p style={{ margin: 0 }}>Описание: {subcategory.description || "Не указано"}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-alarm-fill" style={{ marginRight: '10px' }}></i>
                <p>
                  Время работы:  {subcategory.opening_time || "Не указано"} -{" "}
                  {subcategory.closing_time || "Не указано"}
                </p>
              </div>
              {(subcategory.lunch_start || subcategory.lunch_end) && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="bi bi-clock-fill" style={{ marginRight: '10px' }}></i>
                  {subcategory.lunch_start && (
                    <p><strong>Обед с:  </strong>{subcategory.lunch_start}</p>
                  )}
                  {subcategory.lunch_end && (
                    <p><strong>До: </strong> {subcategory.lunch_end}</p>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-calendar-check-fill" style={{ marginRight: '10px' }}></i>
                <p>
                {subcategory.specific_date
                  ? `Дата: ${formatDate(subcategory.specific_date)}`
                  : `Дни работы: ${formatWorkingDays(subcategory)}`}
                </p>
              </div>                   
            </li>
          ))}
        </ul>
        <div className="button-pagination">
          <button onClick={handlePrevPage} disabled={!prevPage}>
            Назад
          </button>
          <button onClick={handleNextPage} disabled={!nextPage}>
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryFilter;
