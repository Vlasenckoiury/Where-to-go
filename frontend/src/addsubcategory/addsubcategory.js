import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addsubcategory.css";


const handleSubmit = async (e) => {
  e.preventDefault(); // Предотвращаем перезагрузку страницы

  try {
    setLoading(true);

    const formDataToSend = {
      city_id: selectedCity, // ID города
      category_id: selectedCategory, // ID категории
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      description: formData.description,
      opening_time: formData.opening_time,
      closing_time: formData.closing_time,
      lunch_start: formData.lunch_start,
      lunch_end: formData.lunch_end,
      is_monday: formData.is_monday,
      is_tuesday: formData.is_tuesday,
      is_wednesday: formData.is_wednesday,
      is_thursday: formData.is_thursday,
      is_friday: formData.is_friday,
      is_saturday: formData.is_saturday,
      is_sunday: formData.is_sunday,
      specific_date: formData.specific_date,
    };

    // Если есть файл изображения, добавьте его через FormData
    const formData = new FormData();
    for (const key in formDataToSend) {
      formData.append(key, formDataToSend[key]);
    }

    if (file) {
      formData.append("image", file); // Добавляем изображение
    }

    const response = await axios.post("http://127.0.0.1:8000/api/subcategories/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setSuccess("Запись успешно добавлена!");
    setFormData({}); // Сброс данных формы
  } catch (err) {
    setError("Ошибка при добавлении записи: " + (err.response?.data || err.message));
  } finally {
    setLoading(false);
  }
};

return (
  <div className="form-container-add-subcategory">
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

      {/* Кнопка сохранения */}
      <button className="add-button" type="submit" disabled={loading}>
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  </div>
);

export default handleSubmit;
