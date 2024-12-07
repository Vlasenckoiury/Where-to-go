from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _
from django.core.exceptions import ValidationError


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
    CAFE = 'CAFE'
    ENTERTAINMENT = 'ENTERTAINMENT'

    CATEGORY_CHOICES = [
        (CAFE, 'Кафе'),
        (ENTERTAINMENT, 'Развлечения'),
    ]

    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()


class Subcategory(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="subcategories")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    
    # Поля для категории "Кафе"
    name = models.CharField(max_length=100, blank=True, null=True)  # Имя кафе
    working_hours = models.CharField(max_length=100, blank=True, null=True)  # Режим работы
    
    # Поля для категории "Развлечения"
    phone = models.CharField(max_length=15, blank=True, null=True)  # Телефон
    address = models.CharField(max_length=255, blank=True, null=True)  # Адрес

    def clean(self):
        # Проверка для категории "Кафе"
        if self.category.name == Category.CAFE:
            if not self.name or not self.working_hours:
                raise ValidationError("Для категории 'Кафе' необходимо указать имя и режим работы.")
            if self.phone or self.address:
                raise ValidationError("Для категории 'Кафе' не нужно указывать телефон или адрес.")

        # Проверка для категории "Развлечения"
        if self.category.name == Category.ENTERTAINMENT:
            if not self.phone or not self.address:
                raise ValidationError("Для категории 'Развлечения' необходимо указать телефон и адрес.")
            if self.name or self.working_hours:
                raise ValidationError("Для категории 'Развлечения' не нужно указывать имя или режим работы.")

    def __str__(self):
        return f"{self.category.get_name_display()}: {self.city.name}"

