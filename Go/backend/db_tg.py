## -*- coding: utf-8 -*-
import psycopg2
from functools import wraps
import os
# from dotenv import load_dotenv


def db_connection(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
        )
        cursor = conn.cursor()
        try:
            result = func(cursor, *args, **kwargs)
            conn.commit()
            print("Соединение с PostgreSQL установлено")
            return result
        except (Exception, psycopg2.Error) as error:
            print("Ошибка при работе с PostgreSQL", error)
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
            print("Соединение с PostgreSQL закрыто")
    return wrapper


@db_connection
def insert_tg(cursor, user_id, username, first_name, last_name):
    # SQL-запрос для вставки данных
    insert_query = """
    INSERT INTO av_car_botuser (telegram_id, username, first_name, last_name) VALUES (%s, %s, %s, %s)
    """
    # Выполнение запроса
    cursor.execute(insert_query, (user_id, username, first_name, last_name))
    print("Данные успешно сохранены в базе данных")


@db_connection
def get_countries(cursor):
    cursor.execute("SELECT name FROM countries")
    countries = [row[0] for row in cursor.fetchall()]
    return countries