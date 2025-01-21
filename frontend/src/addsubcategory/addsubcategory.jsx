import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addsubcategory.css";

const SubCategoryAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    city: "",
    address: "",
    phone: "",
    description: "",
    opening_time: "",
    closing_time: "",
    lunch_start: "",
    lunch_end: "",
    is_monday: false,
    is_tuesday: false,
    is_wednesday: false,
    is_thursday: false,
    is_friday: false,
    is_saturday: false,
    is_sunday: false,
    specific_date: "",
    image: null,
    reservation_url: "",
  });
  const [file, setFile] = useState(null);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запрос для стран
        const countriesResponse = await axios.get("http://localhost:8000/api/countries/");
        setCountries(countriesResponse.data.results || countriesResponse.data || []); 
  
        // Запрос для категорий
        const categoriesResponse = await axios.get("http://localhost:8000/api/category/?no_paginate=true");
        setCategories(categoriesResponse.data || []); 
  
      } catch (error) {
        console.error("Ошибка загрузки данных", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedRegion(""); // Сбросить выбранный регион
    setSelectedCity(""); // Сбросить выбранный город
    setRegions([]); // Очищаем регионы
    setCities([]); // Очищаем города

    if (countryId) {
      axios
        .get(`http://localhost:8000/api/regions/?country=${countryId}&no_paginate=true`)
        .then((response) => {
          setRegions(response.data || []); // Загружаем регионы
        })
        .catch((error) => {
          console.error("Ошибка загрузки регионов", error);
        });
    }

    // setFormData((prevData) => ({
    //   ...prevData,
    //   country: countryId, // Сохраняем выбранную страну в formData
    // }));
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedCity(""); // Сбросить выбранный город
    setCities([]); // Очищаем города

    if (regionId) {
      axios
        .get(`http://localhost:8000/api/cities/?region=${regionId}&no_paginate=true`)
        .then((response) => {
          setCities(response.data || []); // Загружаем города
        })
        .catch((error) => {
          console.error("Ошибка загрузки городов", error);
        });
    }

    // setFormData((prevData) => ({
    //   ...prevData,
    //   region: regionId, // Сохраняем выбранный регион в formData
    // }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);  // Обновляем выбранную категорию
  
    setFormData((prevData) => ({
      ...prevData,
      category: categoryId,  // Сохраняем выбранную категорию в formData
    }));
  };

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
  
    setFormData((prevData) => ({
      ...prevData,
      city: cityId, // Сохраняем выбранный город в formData
    }));
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData((prevData) => ({
        ...prevData,
        image: e.target.files[0], // Сохраняем файл для проверки
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      // Создание FormData для отправки данных
      const sendData = new FormData();
      sendData.append("city_id", selectedCity || "");
      sendData.append("category_id", selectedCategory || "");
      sendData.append("name", formData.name || "");
      sendData.append("address", formData.address || "");
      sendData.append("phone", formData.phone || "");
      sendData.append("description", formData.description || "");
      sendData.append("opening_time", formData.opening_time || "");
      sendData.append("closing_time", formData.closing_time || "");
      sendData.append("lunch_start", formData.lunch_start || "");
      sendData.append("lunch_end", formData.lunch_end || "");
      sendData.append("is_monday", formData.is_monday ? "1" : "0");
      sendData.append("is_tuesday", formData.is_tuesday ? "1" : "0");
      sendData.append("is_wednesday", formData.is_wednesday ? "1" : "0");
      sendData.append("is_thursday", formData.is_thursday ? "1" : "0");
      sendData.append("is_friday", formData.is_friday ? "1" : "0");
      sendData.append("is_saturday", formData.is_saturday ? "1" : "0");
      sendData.append("is_sunday", formData.is_sunday ? "1" : "0");
      sendData.append("specific_date", formData.specific_date || "");
      sendData.append("reservation_url", formData.reservation_url || "");
  
      // Если есть изображение, добавляем его в FormData
      if (file) {
        sendData.append("image", file);
      }
  
      // Отправка данных на сервер
      const response = await axios.post("http://127.0.0.1:8000/api/subcategories/", sendData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Указываем правильный Content-Type
        },
      });
  
      setSuccess("Запись успешно добавлена!");
      setFormData({
        name: "",
        address: "",
        phone: "",
        description: "",
        opening_time: "",
        closing_time: "",
        lunch_start: "",
        lunch_end: "",
        is_monday: false,
        is_tuesday: false,
        is_wednesday: false,
        is_thursday: false,
        is_friday: false,
        is_saturday: false,
        is_sunday: false,
        specific_date: "",
        reservation_url: "",
      });
      setFile(null);  // Сбрасываем файл после успешной отправки
  
    } catch (err) {
      console.error("Ошибка при добавлении записи:", err.response || err.message);
  
      // Проверяем ошибку от сервера
      if (err.response) {
        // Если сервер вернул ошибку с данными
        setError(`Ошибка: ${err.response.data.message || err.response.data}`);
      } else {
        // Если ошибка связана с сетью или другие ошибки
        setError(`Ошибка при отправке: ${err.message}`);
      }
    } finally {
      setLoading(false);  // Завершаем загрузку
    }
  };  
  
  return (
    <div className="form-container-add-subcategory">
      <div className="info-button">
        <a href="/" className="btn-home">Главная</a>
      </div>
      <h3>Добавить подкатегорию</h3>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Страна */}
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

        {/* Область */}
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

        {/* Город */}
        <div className="form-group">
          <label>Город:</label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
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

        {/* Категория */}
        <div className="form-group">
          <label>Категория:</label>
          <select
            value={selectedCategory}  // Отображаем текущую выбранную категорию
            onChange={(e) => handleCategoryChange(e.target.value)}  // Обработчик изменения
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

        {/* Название */}
        <div className="form-row">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название"
            required
          />
        </div>

        {/* Адрес */}
        <div className="form-row">
          <label htmlFor="address">Адрес</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Введите адрес"
          />
        </div>

        {/* Телефон */}
        <div className="form-row">
          <label htmlFor="phone">Телефон</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Введите телефон"
          />
        </div>

        {/* Описание */}
        <div className="form-row">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Введите описание"
          ></textarea>
        </div>

        {/* Изображение */}
        <div className="form-row">
          <label htmlFor="image">Изображение</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
          />
        </div>

        {/* Время открытия и закрытия */}
        <div className="form-row">
          <label htmlFor="opening_time">Время открытия</label>
          <input
            type="time"
            id="opening_time"
            name="opening_time"
            value={formData.opening_time}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="closing_time">Время закрытия</label>
          <input
            type="time"
            id="closing_time"
            name="closing_time"
            value={formData.closing_time}
            onChange={handleChange}
          />
        </div>
        {/* Время начала обеда */}
        <div className="form-group">
          <label>Начало обеда:</label>
          <input
            type="time"
            name="lunch_start"
            value={formData.lunch_start}
            onChange={handleChange}
          />
        </div>

        {/* Время конца обеда */}
        <div className="form-group">
          <label>Конец обеда:</label>
          <input
            type="time"
            name="lunch_end"
            value={formData.lunch_end}
            onChange={handleChange}
          />
        </div>

        {/* Дни недели */}
        <div className="form-group">
          <label>Дни недели:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="is_monday"
                checked={formData.is_monday}
                onChange={handleCheckboxChange}
              />
              Понедельник
            </label>
            <label>
              <input
                type="checkbox"
                name="is_tuesday"
                checked={formData.is_tuesday}
                onChange={handleCheckboxChange}
              />
              Вторник
            </label>
            <label>
              <input
                type="checkbox"
                name="is_wednesday"
                checked={formData.is_wednesday}
                onChange={handleCheckboxChange}
              />
              Среда
            </label>
            <label>
              <input
                type="checkbox"
                name="is_thursday"
                checked={formData.is_thursday}
                onChange={handleCheckboxChange}
              />
              Четверг
            </label>
            <label>
              <input
                type="checkbox"
                name="is_friday"
                checked={formData.is_friday}
                onChange={handleCheckboxChange}
              />
              Пятница
            </label>
            <label>
              <input
                type="checkbox"
                name="is_saturday"
                checked={formData.is_saturday}
                onChange={handleCheckboxChange}
              />
              Суббота
            </label>
            <label>
              <input
                type="checkbox"
                name="is_sunday"
                checked={formData.is_sunday}
                onChange={handleCheckboxChange}
              />
              Воскресенье
            </label>
          </div>
        </div>

        {/* Определенная дата */}
        <div className="form-row">
          <label htmlFor="specific_date">Определенная дата</label>
          <input
            type="date"
            id="specific_date"
            name="specific_date"
            value={formData.specific_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="reservation_url">Ссылка на бронирование</label>
          <input
            type="url"
            id="reservation_url"
            name="reservation_url"
            value={formData.reservation_url}
            onChange={handleChange}
            placeholder="Введите ссылку для бронирования"
          />
        </div>

        {/* Кнопка сохранения */}
        <button className="add-button" type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
};

export default SubCategoryAdd;
