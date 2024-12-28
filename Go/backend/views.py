from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, SubcategorySerializer
from .serializers import (
    RegisterSerializer, SubcategorySerializer, CountrySerializer, RegionSerializer, CitySerializer, CategorySerializer
)
from .models import CustomUser, Subcategory, Country, Region, City, Category
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=205)
        except Exception as e:
            return Response(status=400)


class OptionalPagination(PageNumberPagination):
    def paginate_queryset(self, queryset, request, view=None):
        # Проверяем параметр no_paginate
        if request.query_params.get('no_paginate') == 'true':
            return None  # Отключаем пагинацию
        return super().paginate_queryset(queryset, request, view)
    

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    pagination_class = OptionalPagination

    def get_queryset(self):
        country_id = self.request.query_params.get('country')
        if country_id:
            return self.queryset.filter(country_id=country_id)
        return self.queryset


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    pagination_class = OptionalPagination

    def get_queryset(self):
        region_id = self.request.query_params.get('region')
        if region_id:
            return self.queryset.filter(region_id=region_id)
        return self.queryset


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = OptionalPagination

    def get_queryset(self):
        category_id = self.request.query_params.get('city')
        if category_id:
            return self.queryset.filter(category_id=category_id)
        return self.queryset


class SubcategoryViewSet(viewsets.ModelViewSet):
    pagination_class = PageNumberPagination
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        country_id = self.request.query_params.get('country')
        region_id = self.request.query_params.get('region')
        city_id = self.request.query_params.get('city')
        category_id = self.request.query_params.get('category')

        queryset = self.queryset
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if city_id:
            queryset = queryset.filter(city_id=city_id)
        elif region_id:
            queryset = queryset.filter(region__id=region_id)
        elif country_id:
            queryset = queryset.filter(region__country__id=country_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save()
