## -*- coding: utf-8 -*-
import psycopg2
from functools import wraps
import os


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
    INSERT INTO backend_botuser (telegram_id, username, first_name, last_name) VALUES (%s, %s, %s, %s)
    """
    # Выполнение запроса
    cursor.execute(insert_query, (user_id, username, first_name, last_name))
    print("Данные успешно сохранены в базе данных")


@db_connection
def get_contact(cursor, message):
    update_query = f"""UPDATE backend_botuser SET contact = %s WHERE telegram_id = {message.chat.id}"""
    # Выполнение запроса
    cursor.execute(update_query, (message.contact.phone_number, ))
    print(f"Значение в колонке {message.contact.phone_number} пользователя с telegram_id {message.chat.id} успешно обновлено в базе данных")


@db_connection
def get_countries(cursor):
    try:
        cursor.execute("SELECT name FROM public.backend_country")
        countries = [row[0] for row in cursor.fetchall()]
        return countries
    except Exception as err:
        print(f"Страна не получена {err}")


@db_connection
def get_regions(cursor, country_name):
    try:
        cursor.execute("""
        SELECT backend_region.name FROM backend_region
        JOIN backend_country ON backend_region.country_id = backend_country.id
        WHERE backend_country.name = %s
        """, (country_name,))
        regions = [row[0] for row in cursor.fetchall()]
        return regions
    except Exception as err:
        print(f'Области не получены {err}')


@db_connection
def get_cities(cursor, region_name):
    try:
        cursor.execute("""
            SELECT backend_city.name FROM backend_city
            JOIN backend_region ON backend_city.region_id = backend_region.id
            WHERE backend_region.name = %s
        """, (region_name,))
        cities = [row[0] for row in cursor.fetchall()]
        return cities
    except Exception as err:
        print(f"Города не получены {err}")


@db_connection
def get_categories(cursor):
    try:
        cursor.execute("SELECT id, name FROM backend_category")
        return cursor.fetchall()
    except Exception as err:
        print(f"Категории не получены {err}")


@db_connection
def get_objects(cursor, city_name, category_id=None):
    subcategory = [
        "subcategories.name",
        "subcategories.address",
        "subcategories.phone",
        "subcategories.description",
        "subcategories.image",
        "subcategories.opening_time",
        "subcategories.closing_time",
        "subcategories.is_friday",
        "subcategories.is_monday",
        "subcategories.is_saturday",
        "subcategories.is_sunday",
        "subcategories.is_thursday",
        "subcategories.is_tuesday",
        "subcategories.is_wednesday",
        "subcategories.specific_date",
        "subcategories.lunch_end",
        "subcategories.lunch_start",
    ]
    try:
        columns = ", ".join(subcategory)
        if category_id is None:
            query = f"""
                SELECT {columns}
                FROM backend_subcategory AS subcategories
                JOIN backend_city AS cities ON subcategories.city_id = cities.id
                WHERE cities.name = %s;
            """
            params = (city_name,)
        else:
            query = f"""
                SELECT {columns}
                FROM backend_subcategory AS subcategories
                JOIN backend_city AS cities ON subcategories.city_id = cities.id
                WHERE cities.name = %s AND subcategories.category_id = %s;
            """
            params = (city_name, category_id)

        cursor.execute(query, params)
        return cursor.fetchall()
    except Exception as err:
        print(f"Объекты не получены {err}")
