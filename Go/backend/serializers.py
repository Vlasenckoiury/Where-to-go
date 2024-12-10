from rest_framework import serializers
from .models import CustomUser, City, Category, Subcategory
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

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class SubcategorySerializer(serializers.ModelSerializer):
    city = CitySerializer(many=True)  # Если  поле ManyToManyField 
    category = CategorySerializer()  # Если поле ForeignKey 

    def validate(self, data):
            instance = Subcategory(**data)
            instance.full_clean()  # Вызывает метод clean() для проверки
            return data

    class Meta:
        model = Subcategory
        fields = '__all__'
