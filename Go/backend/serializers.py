from rest_framework import serializers
from .models import CustomUser, City, Category, Subcategory, Region, Country
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import sys
import json
import os

SMARTCAPTCHA_SERVER_KEY = os.getenv("SMARTCAPTCHA_SERVER_KEY", "")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser  # Используем CustomUser вместо User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    captcha_token = serializers.CharField(write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'captcha_token', 'token')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_captcha_token(self, token):
        response = requests.get(
            "https://smartcaptcha.yandexcloud.net/validate",
            params={
                "secret": SMARTCAPTCHA_SERVER_KEY,
                "token": token,
            },
            timeout=1
        )
        if response.status_code != 200 or not response.json().get("status") == "ok":
            raise serializers.ValidationError("Капча не пройдена.")
        return token

    def create(self, validated_data):
        validated_data.pop('captcha_token')  # Удаляем токен капчи после проверки
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        refresh = RefreshToken.for_user(user)
        user.token = str(refresh.access_token)
        return user
    

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class RegionSerializer(serializers.ModelSerializer):
    country = CountrySerializer()
    
    class Meta:
        model = Region
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    region = RegionSerializer()

    class Meta:
        model = City
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SubcategorySerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)  # Вложенный сериализатор для отображения
    category = CategorySerializer(read_only=True)  # Вложенный сериализатор для отображения
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(),
        source='city',  # Привязываем к полю модели
        write_only=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',  # Привязываем к полю модели
        write_only=True
    )

    class Meta:
        model = Subcategory
        fields = '__all__'

    def validate(self, data):
        instance = Subcategory(**data)
        instance.full_clean()  # Вызывает метод clean() для проверки
        return data
