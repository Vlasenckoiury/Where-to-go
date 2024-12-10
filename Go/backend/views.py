from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, SubcategorySerializer
from .models import CustomUser, Subcategory
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination


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


class SubcategoryListView(APIView):
    pagination_class = PageNumberPagination  # Указываем класс пагинации

    def get(self, request, *args, **kwargs):
        queryset = Subcategory.objects.all()
        paginator = self.pagination_class()  # Создаем экземпляр пагинатора
        page = paginator.paginate_queryset(queryset, request)  # Правильное использование пагинации

        if page is not None:
            return paginator.get_paginated_response(SubcategorySerializer(page, many=True).data)
        
        # Если пагинации нет (например, запрос всех элементов), возвращаем все элементы
        return Response(SubcategorySerializer(queryset, many=True).data)

    def post(self, request):
        serializer = SubcategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)