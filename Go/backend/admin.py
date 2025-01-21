from django.contrib import admin
from .models import CustomUser, City, Category, Subcategory, Region, Country


admin.site.register(CustomUser)


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'city', 'get_working_days', 'specific_date', 'reservation_url')
    search_fields = ('name', 'category__name')
    fieldsets = (
        (None, {
            'fields': ('city', 'category', 'name', 'address', 'phone', 'description', 'image', 'specific_date', 'reservation_url')
        }),
        ('Время работы', {
            'fields': ('opening_time', 'closing_time', 
                       'lunch_start', 'lunch_end')
        }),
        ('Дни работы', {
            'fields': (
                'is_monday', 'is_tuesday', 'is_wednesday', 
                'is_thursday', 'is_friday', 'is_saturday', 'is_sunday'
            )
        }),
    )

    def get_working_days(self, obj):
        days = []
        days_map = {
            'Пн': obj.is_monday, 'Вт': obj.is_tuesday, 'Ср': obj.is_wednesday,
            'Чт': obj.is_thursday, 'Пт': obj.is_friday, 'Сб': obj.is_saturday,
            'Вс': obj.is_sunday
        }
        for day, active in days_map.items():
            if active:
                days.append(day)
        return ", ".join(days) or "Не указано"
    get_working_days.short_description = 'Дни работы'


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'region']

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'country']

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

