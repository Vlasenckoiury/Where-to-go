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
    // Загрузка стран и категорий при инициализации
    axios.get("http://localhost:8000/api/countries/").then((response) => {
      setCountries(response.data.results || []);
    });

    axios.get("http://localhost:8000/api/category/").then((response) => {
      setCategories(response.data.results || []);
    });
  }, []);

  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedRegion("");
    setSelectedCity("");
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
    setSelectedCity("");
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

  return (
    <div>
      <h2>Фильтровать подкатегории</h2>

      <div>
        <label>Страна:</label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
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
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleFilter}>Применить фильтры</button>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h3>Подкатегории</h3>
        <ul>
          {subcategories.map((subcategory) => (
            <li key={subcategory.id}>{subcategory.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubCategoryFilter;
