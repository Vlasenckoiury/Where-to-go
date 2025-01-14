from django.core.management.base import BaseCommand
from Where_to_go.Go.backend.bot import bot


class Command(BaseCommand):
    help = 'Запуск бота'

    def handle(self, *args, **options):
        try:
            print('Бот запущен')
            bot.infinity_polling()
        except Exception as err:
            print(f'Ошибка: {err}')
        
