import telebot
from django.conf import settings
from backend.db_tg import *
from telebot import types
from telebot.types import ReplyKeyboardMarkup, KeyboardButton

from django.core.exceptions import ObjectDoesNotExist

bot = telebot.TeleBot(settings.TELEGRAM_TOKEN, parse_mode='HTML')

user_state = {}

@bot.message_handler(commands=['start'])
def send_welcome(message):
    user_id = message.from_user.id
    username = f'@{message.from_user.username}'
    first_name = message.from_user.first_name
    last_name = message.from_user.last_name
    bot.send_message(message.chat.id, """🚶‍♂️‍➡️""",)
    bot.send_message(message.chat.id, """Добро пожаловать в Where to go\nВыберите команду в <b>Меню</b>""",)
    chat_id = message.chat.id
    user_state[chat_id] = {"step": "select_country"}
    countries = get_countries()
    markup = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    for country in countries:
        markup.add(KeyboardButton(country))
    bot.send_message(chat_id, "Выберите страну:", reply_markup=markup)
    # return insert_tg(user_id, username, first_name, last_name)

@bot.message_handler(commands=['news'])
def news(message):
    try:
        links = get_all_links()
        if links:
            reply_markup = types.InlineKeyboardMarkup()
            for link in links:
                button = types.InlineKeyboardButton(text=link[0], url=link[1])
                reply_markup.add(button)
            bot.send_message(message.chat.id, "<b></b> 📰")
            bot.send_message(message.chat.id, "<b>Выберите Канал</b>", parse_mode='HTML', reply_markup=reply_markup)
        else:
            bot.send_message(message.chat.id, "Нет доступных каналов новостей.")
    except Exception as e:
        bot.reply_to(message, f"Произошла ошибка: {e}")
        bot.reply_to(message, f"Произошла ошибка перезапустите бота /start")