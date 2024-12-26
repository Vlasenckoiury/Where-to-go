from rest_framework import serializers
from .models import CustomUser, City, Category, Subcategory, Region, Country
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser  # Используем CustomUser вместо User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = CustomUser  # Используем CustomUser вместо User
        fields = ('username', 'password', 'email', 'token')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(  # Используем CustomUser вместо User
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
        fields = ['name'] 

class RegionSerializer(serializers.ModelSerializer):
    country = CountrySerializer()
    
    class Meta:
        model = Region
        fields = ['name', 'country']

class CitySerializer(serializers.ModelSerializer):
    region = RegionSerializer()

    class Meta:
        model = City
        fields = ['name', 'region']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

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

