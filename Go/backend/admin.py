from django.contrib import admin
from .models import CustomUser, City, Category, Subcategory


admin.site.register(CustomUser)
admin.site.register(City)
admin.site.register(Category)
@admin.register(Subcategory)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
