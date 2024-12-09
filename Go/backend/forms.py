from django import forms
from .models import Subcategory

class SubcategoryForm(forms.ModelForm):
    # Выбор рабочих дней
    days_of_week = [
        ('Mon', 'Понед.'),
        ('Tue', 'Вторник'),
        ('Wed', 'Среда'),
        ('Thu', 'Четверг'),
        ('Fri', 'Пятница'),
        ('Sat', 'Суббота'),
        ('Sun', 'Воскресенье'),
    ]
    
    working_days = forms.MultipleChoiceField(
        required=False,
        widget=forms.CheckboxSelectMultiple,
        choices=days_of_week,
        label="Дни недели",
    )

    class Meta:
        model = Subcategory
        fields = '__all__'  # Вы можете указать нужные поля
        widgets = {
        }

    def clean_working_days(self):
        selected_days = self.cleaned_data.get('working_days', [])
        return ",".join(selected_days)  # Преобразуем выбранные дни в строку, разделенную запятой
