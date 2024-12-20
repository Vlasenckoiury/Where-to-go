import React, { useState, useEffect } from 'react';
import { YMap, Map, Placemark, GeolocationControl } from '@pbe/react-yandex-maps';
import './Maps.css';

const Maps = async () => {
  const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify');
  const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);
  const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} = reactify.module(ymaps3);

  useEffect(() => {
    // Загружаем текущую геопозицию пользователя
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
        },
        () => {
          console.error('Не удалось получить геопозицию');
        }
      );
    }
  }, []);

  return (
    <div className="map-section">
      <h3>Карта</h3>
        <YMap location={{center: [25.229762, 55.289311], zoom: 9}} mode="vector">
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        <YMapMarker coordinates={[25.229762, 55.289311]} draggable={true}>
          <section>
            <h1>You can drag this header</h1>
          </section>
        </YMapMarker>
        </YMap>
    </div>
  );
};

export default Maps;
