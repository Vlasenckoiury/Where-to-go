import telebot
from Where_to_go.Go.Go.settings import TELEGRAM_TOKEN
from Where_to_go.Go.backend.db_tg import *
from telebot import types
from telebot.types import ReplyKeyboardMarkup, KeyboardButton
from django.core.exceptions import ObjectDoesNotExist

bot = telebot.TeleBot(TELEGRAM_TOKEN, 'HTML')

print("Бот запущен")


@bot.message_handler(commands=['start'])
def send_welcome(message):
    user_id = message.from_user.id
    username = f'@{message.from_user.username}'
    first_name = message.from_user.first_name
    last_name = message.from_user.last_name
    bot.send_message(message.chat.id, """🚶‍♂️‍➡️""",)
    bot.send_message(message.chat.id, f"""Добро пожаловать {first_name} в Where to go\nВыберите команду в <b>Меню</b>""",)
    # return insert_tg(user_id, username, first_name, last_name)


@bot.message_handler(commands=['go'])
def start_go(message):
    countries = get_countries()
    if countries:
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
        for country in countries:
            markup.add(types.KeyboardButton(country))
        bot.send_message(message.chat.id, "🌍 Выберите страну:", reply_markup=markup)
        bot.register_next_step_handler(message, select_country)
    else:
        bot.send_message(message.chat.id, "Не удалось загрузить список стран.")


def select_country(message):
    country_name = message.text
    regions = get_regions(country_name)
    if regions:
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
        for region in regions:
            markup.add(types.KeyboardButton(region))
        bot.send_message(message.chat.id, f"Вы выбрали страну 🌍 {country_name}. \nТеперь выберите регион:", reply_markup=markup)
        bot.register_next_step_handler(message, select_region, country_name)
    else:
        bot.send_message(message.chat.id, "Не удалось загрузить регионы.")


def select_region(message, country_name):
    region_name = message.text
    cities = get_cities(region_name)
    if cities:
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
        for city in cities:
            markup.add(types.KeyboardButton(city))
        bot.send_message(message.chat.id, f"Вы выбрали регион {region_name}.\n Теперь выберите город:", reply_markup=markup)
        bot.register_next_step_handler(message, select_city, country_name, region_name)
    else:
        bot.send_message(message.chat.id, "Не удалось загрузить города.")


def select_city(message, country_name, region_name):
    city_name = message.text
    categories = get_categories()
    if categories:
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
        markup.add(types.KeyboardButton("Все Категории"))  # Добавляем кнопку "Все категории"
        for category_id, category_name in categories:
            markup.add(types.KeyboardButton(category_name))
        bot.send_message(message.chat.id, f"Вы выбрали город 🏙 {city_name}.\n Теперь выберите категорию.", reply_markup=markup)
        bot.register_next_step_handler(message, select_category, city_name)
    else:
        bot.send_message(message.chat.id, "Не удалось загрузить категории.")


def select_category(message, city_name):
    subcategory = {
        "subcategories.name": "📍 Название",
        "subcategories.address": "🗺 Адрес",
        "subcategories.phone": "📞 Телефон",
        "subcategories.description": "📝 Описание",
        "subcategories.image": "📸 Изображение",
        "subcategories.opening_time": "⏰ Время открытия",
        "subcategories.closing_time": "⏰ Время закрытия",
        "subcategories.is_friday": "Открыто в пятницу",
        "subcategories.is_monday": "Открыто в понедельник",
        "subcategories.is_saturday": "Открыто в субботу",
        "subcategories.is_sunday": "Открыто в воскресенье",
        "subcategories.is_thursday": "Открыто в четверг",
        "subcategories.is_tuesday": "Открыто во вторник",
        "subcategories.is_wednesday": "Открыто в среду",
        "subcategories.specific_date": "📅 Дата",
        "subcategories.lunch_end": "🕞 Окончание обеденного перерыва",
        "subcategories.lunch_start": "🕘 Начало обеденного перерыва",
    }

    weekdays_mapping = {
        "subcategories.is_monday": "понедельник",
        "subcategories.is_tuesday": "вторник",
        "subcategories.is_wednesday": "среда",
        "subcategories.is_thursday": "четверг",
        "subcategories.is_friday": "пятница",
        "subcategories.is_saturday": "суббота",
        "subcategories.is_sunday": "воскресенье",
    }
    base_url = "http://127.0.0.1:8000"
    category_name = message.text
    if category_name == "Все Категории":
        # Фильтруем только по городу
        objects = get_objects(city_name)
    else:
        # Ищем ID выбранной категории
        categories = get_categories()
        category_id = next((id for id, name in categories), None)
        if category_id is not None:
            objects = get_objects(city_name, category_id)
        else:
            bot.send_message(message.chat.id, "Не удалось найти указанную категорию.")
            return

    if objects:
        response_lines = []
        for obj in objects:
            obj_details = []
            open_days = []
            for field, value in zip(subcategory, obj):
                if field in weekdays_mapping and value:  # Проверяем, открыт ли объект в день недели
                    open_days.append(weekdays_mapping[field])
                elif field not in weekdays_mapping and value not in (None, False, ""):
                    # Формируем строку с жирным названием поля
                    obj_details.append(f"<b>{subcategory.get(field, field)}:</b> {value}")

            if open_days:
                obj_details.append(f"<b>💼 Открыто в дни недели:</b> {', '.join(open_days)}")  # Добавляем дни недели

            if obj_details:
                response_lines.append("\n".join(obj_details))  # Формируем отдельные блоки для объектов

        if response_lines:
            response = "\n\n".join(response_lines)  # Формируем итоговый ответ
            bot.send_message(message.chat.id, f"<b>Список объектов:</b>\n{response}", parse_mode="HTML")
        else:
            bot.send_message(message.chat.id, "Все объекты пусты или недоступны.")
    else:
        bot.send_message(message.chat.id, "Объекты не найдены.")


bot.polling()
