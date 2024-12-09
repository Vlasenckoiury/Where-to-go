from django.contrib import admin
from .models import CustomUser, City, Category, Subcategory


admin.site.register(CustomUser)


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'get_city')
    search_fields = ('name', 'category__name')
    filter_horizontal = ('city',)

    def get_city(self, obj):
        if obj.city.exists():
            return ", ".join([city.name for city in obj.city.all()])
        return "Все города"
    get_city.short_description = "Города"

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

