import os
import json
from django.core.management.base import BaseCommand
from backend.models import Country, Region, City


class Command(BaseCommand):
    help = 'Загрузка данных о городах и областях из JSON-файла'

    def handle(self, *args, **options):
        # Определение пути к файлу
        json_file_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),  # Получаем директорию текущего скрипта
            'by-cities.json'  # Имя вашего JSON-файла
        )

        # Проверка, существует ли файл
        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f"Файл {json_file_path} не найден"))
            return

        # Открытие и загрузка данных из JSON-файла
        with open(json_file_path, encoding="utf-8") as file:
            data = json.load(file)

        # Получаем страну
        country_name = data.get('name')

        # Создаем страну или находим существующую
        country, created = Country.objects.get_or_create(name=country_name)

        self.stdout.write(self.style.SUCCESS(f"Страна {country.name} добавлена"))

        # Загружаем области
        for region_data in data.get('regions', []):
            region_name = region_data.get('name')

            # Создаем или находим область по имени и стране
            region, created = Region.objects.get_or_create(name=region_name, country=country)
            self.stdout.write(self.style.SUCCESS(f"Область {region.name} добавлена"))

            # Загружаем города в эту область
            for city_data in region_data.get('cities', []):
                city_name = city_data['name']
                lat = city_data['lat']
                lng = city_data['lng']

                # Создаем или находим город
                city, created = City.objects.get_or_create(
                    name=city_name,
                    region=region,
                    lat=lat,
                    lng=lng,
                )
                self.stdout.write(self.style.SUCCESS(f"Город {city.name} добавлен в область {region.name}"))

        self.stdout.write(self.style.SUCCESS('Загрузка данных завершена'))
