from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import CallbackContext

# Словарь для хранения состояния пользователей
user_states = {}

# Состояния диалога
STATES = {
    'SELECT_COUNTRY': 'select_country',
    'SELECT_REGION': 'select_region',
    'SELECT_CITY': 'select_city',
    'SELECT_CATEGORY': 'select_category',
}

# Заглушки для данных
def get_countries():
    return ['Страна 1', 'Страна 2', 'Страна 3']

def get_regions(country):
    return ['Регион 1', 'Регион 2', 'Регион 3']

def get_cities(region):
    return ['Город 1', 'Город 2', 'Город 3']

def get_categories(city):
    return ['Категория 1', 'Категория 2', 'Категория 3']

def get_subcategories(category):
    return ['Объект 1', 'Объект 2', 'Объект 3']

# Обработка команды /start
def start(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    user_states[user_id] = {}
    countries = get_countries()
    keyboard = [[country] for country in countries]
    reply_markup = ReplyKeyboardMarkup(keyboard, one_time_keyboard=True)
    update.message.reply_text('Выберите страну:', reply_markup=reply_markup)
    user_states[user_id]['state'] = STATES['SELECT_COUNTRY']

# Обработка выбора страны
def select_country(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    if user_states.get(user_id, {}).get('state') == STATES['SELECT_COUNTRY']:
        country = update.message.text
        user_states[user_id]['country'] = country
        regions = get_regions(country)
        keyboard = [[region] for region in regions]
        reply_markup = ReplyKeyboardMarkup(keyboard, one_time_keyboard=True)
        update.message.reply_text('Выберите регион:', reply_markup=reply_markup)
        user_states[user_id]['state'] = STATES['SELECT_REGION']

# Обработка выбора региона
def select_region(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    if user_states.get(user_id, {}).get('state') == STATES['SELECT_REGION']:
        region = update.message.text
        user_states[user_id]['region'] = region
        cities = get_cities(region)
        keyboard = [[city] for city in cities]
        reply_markup = ReplyKeyboardMarkup(keyboard, one_time_keyboard=True)
        update.message.reply_text('Выберите город:', reply_markup=reply_markup)
        user_states[user_id]['state'] = STATES['SELECT_CITY']

# Обработка выбора города
def select_city(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    if user_states.get(user_id, {}).get('state') == STATES['SELECT_CITY']:
        city = update.message.text
        user_states[user_id]['city'] = city
        categories = get_categories(city)
        keyboard = [[category] for category in categories]
        reply_markup = ReplyKeyboardMarkup(keyboard, one_time_keyboard=True)
        update.message.reply_text('Выберите категорию:', reply_markup=reply_markup)
        user_states[user_id]['state'] = STATES['SELECT_CATEGORY']

# Обработка выбора категории
def select_category(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    if user_states.get(user_id, {}).get('state') == STATES['SELECT_CATEGORY']:
        category = update.message.text
        user_states[user_id]['category'] = category
        subcategories = get_subcategories(category)
        response = '\n'.join(subcategories)
        update.message.reply_text(f'Список объектов:\n{response}')
        user_states[user_id]['state'] = None
