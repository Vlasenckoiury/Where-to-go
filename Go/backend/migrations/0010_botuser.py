# Generated by Django 5.1.2 on 2025-01-14 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0009_remove_subcategory_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='BotUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('telegram_id', models.PositiveBigIntegerField(db_index=True, unique=True, verbose_name='ID Telegram')),
                ('username', models.CharField(blank=True, max_length=100, null=True, verbose_name='Username')),
                ('first_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Имя')),
                ('last_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Фамилия')),
                ('contact', models.CharField(blank=True, max_length=100, null=True, verbose_name='Телефон')),
            ],
            options={
                'verbose_name': 'Пользователь бота',
                'verbose_name_plural': 'Пользователи бота',
            },
        ),
    ]
