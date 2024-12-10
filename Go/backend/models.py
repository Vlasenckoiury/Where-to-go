from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    pass


class City(models.Model):
    name = models.CharField(_('Город'), max_length=100, unique=True)

    class Meta:
        app_label = "backend"
        ordering = ('name',)
        verbose_name = 'Город'
        verbose_name_plural = 'Города'

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(_('Категория'),max_length=100)

    class Meta:
        app_label = "backend"
        ordering = ('name',)
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    city = models.ManyToManyField(City, related_name='cities', verbose_name=_('Город'))
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category', verbose_name=_('Категория'), blank=True, null=True)
    name = models.CharField(_('Название'), max_length=100, null=True, blank=True)
    address = models.CharField(_('Адрес'), max_length=255, blank=True, null=True)
    phone = models.CharField(_('Телефон'), max_length=20, blank=True, null=True)
    description = models.TextField(_('Описание'), blank=True, null=True)
    image = models.ImageField(_('Изображение'), upload_to='images/', blank=True, null=True)
    opening_time = models.TimeField(_('Время открытия'), null=True, blank=True, help_text='Пример ввода времени: 10:00:00')
    closing_time = models.TimeField(_('Время закрытия'), null=True, blank=True, help_text='Пример ввода времени: 10:00:00')
    lunch_start = models.TimeField(_('Начало обеда'), null=True, blank=True)
    lunch_end = models.TimeField(_('Конец обеда'), null=True, blank=True)
    is_monday = models.BooleanField(_('Понедельник'), default=False)
    is_tuesday = models.BooleanField(_('Вторник'), default=False)
    is_wednesday = models.BooleanField(_('Среда'), default=False)
    is_thursday = models.BooleanField(_('Четверг'), default=False)
    is_friday = models.BooleanField(_('Пятница'), default=False)
    is_saturday = models.BooleanField(_('Суббота'), default=False)
    is_sunday = models.BooleanField(_('Воскресенье'), default=False)
    specific_date = models.DateField(_('Определенная дата'), null=True, blank=True)

    class Meta:
        app_label = "backend"
        verbose_name = 'Добавить объект'
        verbose_name_plural = 'Добавить объекты'

    def __str__(self):
        cities = ', '.join([city.name for city in self.city.all()]) if self.city.exists() else 'Все города'
        return f"{cities} - {self.category} - {self.name}"

    def clean(self):
            # Проверка: если указана конкретная дата, дни недели должны быть пустыми
            if self.specific_date:
                if (
                    self.is_monday or self.is_tuesday or self.is_wednesday or
                    self.is_thursday or self.is_friday or self.is_saturday or self.is_sunday
                ):
                    raise ValidationError(_('Если указана конкретная дата, нельзя выбирать дни недели.'))
            
            # Проверка: если указаны дни недели, конкретная дата должна быть пустой
            if (
                self.is_monday or self.is_tuesday or self.is_wednesday or
                self.is_thursday or self.is_friday or self.is_saturday or self.is_sunday
            ):
                if self.specific_date:
                    raise ValidationError(_('Если выбраны дни недели, конкретная дата должна быть пустой.'))
          