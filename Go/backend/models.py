from django.contrib.auth.models import AbstractUser
from django.db import models
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
    city = models.ForeignKey(City, on_delete=models.CASCADE, verbose_name=_('Город'))
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name=_('Категория'))
    name = models.CharField(_('Название'), max_length=100, null=True, blank=True)  
    address = models.CharField(_('Адрес'),max_length=255, blank=True, null=True)  
    phone = models.CharField(_('Телефон'),max_length=20, blank=True, null=True)   
    description = models.TextField(_('Описание'),blank=True, null=True)  
    image = models.ImageField(_('Изображение'),upload_to='images/', blank=True, null=True)
    opening_time = models.TimeField(_('Время октрытия'),null=True, blank=True)
    closing_time = models.TimeField(_('Время закрытия'),null=True, blank=True)
    working_days = models.CharField(_('Дни работы'),max_length=255, blank=True, null=True)

    class Meta:
        app_label = "backend"
        verbose_name = 'Добавить объект'
        verbose_name_plural = 'Добавить объекты'  

    def __str__(self):
        return f"{self.city} - {self.category} - {self.name}"