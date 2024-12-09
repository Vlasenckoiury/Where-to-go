from django.contrib import admin
from .models import CustomUser, City, Category, Subcategory
from .forms import SubcategoryForm



admin.site.register(CustomUser)


class SubcategoryAdmin(admin.ModelAdmin):
    form = SubcategoryForm
    list_display = ['city', 'category', 'name', 'address', 'phone', 'opening_time', 'closing_time', 'working_days']
    list_filter = ['category', 'city']
    search_fields = ['name', 'address']

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['city', 'category', 'name', 'address', 'phone', 'opening_time', 'closing_time', 'working_days']
    list_filter = ['category', 'city']
    search_fields = ['name', 'address']