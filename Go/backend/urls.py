from .views import CountryViewSet, PasswordResetRequestView, RegionViewSet, CityViewSet, SubcategoryViewSet, RegisterView, LogoutView, CategoryViewSet, PasswordResetConfirmView
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
urlpatterns = router.urls

router.register(r'countries', CountryViewSet, basename='countries')
router.register(r'regions', RegionViewSet, basename='regions')
router.register(r'cities', CityViewSet, basename='cities')
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'subcategories', SubcategoryViewSet, basename='subcategories')

urlpatterns = [
    path('', include(router.urls)),  # Включаем маршруты из DefaultRouter
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', TokenObtainPairView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
