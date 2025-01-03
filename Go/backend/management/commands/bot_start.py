from dotenv import load_dotenv
import os
from django.core.management.base import BaseCommand
from telegram.ext import Application, CommandHandler
from bot import start, select_country, select_region, select_city, select_category


async def main():
    TOKEN = '7826289540:AAE-ZItNcYpWdlo4jjOWaXV7lNeB3QCD4NI'
    app = Application.builder().token(TOKEN).build()

    # Обработчики команд
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('select_country', select_country))
    app.add_handler(CommandHandler('select_region', select_region))
    app.add_handler(CommandHandler('select_city', select_city))
    app.add_handler(CommandHandler('select_category', select_category))

    # Запуск бота
    await app.run_polling()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
