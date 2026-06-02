from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    DashboardStatsViewSet, UserViewSet, ProjectViewSet, TaskViewSet,
    TagViewSet, CategoryViewSet, LabelViewSet, PostViewSet,
    InvoiceViewSet, ProfileViewSet, GroupViewSet,
    PermissionListViewSet, UserPermissionsViewSet, MenuViewSet,
    login_view, logout_view, current_user_view,
    captcha_view, captcha_verify_view
)

router = DefaultRouter()
router.register(r'dashboard', DashboardStatsViewSet, basename='dashboard')
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'tags', TagViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'labels', LabelViewSet)
router.register(r'posts', PostViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'permissions', PermissionListViewSet, basename='permissions')
router.register(r'user-permissions', UserPermissionsViewSet, basename='user-permissions')
router.register(r'menu', MenuViewSet, basename='menu')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', login_view, name='api-login'),
    path('api/auth/logout/', logout_view, name='api-logout'),
    path('api/auth/me/', current_user_view, name='api-me'),
    path('api/auth/captcha/', captcha_view, name='api-captcha'),
    path('api/auth/captcha/verify/', captcha_verify_view, name='api-captcha-verify'),
]
