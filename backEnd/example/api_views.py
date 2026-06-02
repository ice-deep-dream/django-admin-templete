from django.contrib.auth.models import Group, Permission
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.core.signing import Signer, BadSignature
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .core.captcha import generate_captcha_text, generate_captcha_image

from .models import User, Tag, Category, Label, Project, Task, Post, Invoice, Profile, MenuItem, RoleMenu
from .serializers import (
    UserSerializer, TagSerializer, CategorySerializer, LabelSerializer,
    ProjectSerializer, TaskSerializer, PostSerializer, InvoiceSerializer,
    ProfileSerializer, DashboardStatsSerializer,
    GroupSerializer, GroupCreateUpdateSerializer, PermissionSerializer,
    UserPermissionSerializer, MenuItemSerializer,
)
from .core.responses import success, error
from .core.viewsets import BaseViewSet, ReadOnlyViewSet
from .core.permissions import ModelPermission
from .core.constants import get_permission_display_name, get_app_display_name


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    captcha_code = request.data.get('captcha_code')
    captcha_token = request.data.get('captcha_token')

    try:
        expected = Signer().unsign(captcha_token or '')
    except BadSignature:
        return error(message='验证码已过期，请刷新后重试', code=400)

    if not captcha_code or expected.upper() != captcha_code.upper().strip():
        return error(message='验证码错误或已过期', code=400)

    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return error(message='请提供用户名和密码', code=400)

    user = authenticate(request, username=username, password=password)

    if user is None:
        return error(message='用户名或密码错误', code=401)

    tokens = get_tokens_for_user(user)

    return success(data={
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        },
    }, message='登录成功')


def captcha_view(request):
    text = generate_captcha_text()
    signed = Signer().sign(text)
    image_data = generate_captcha_image(text)
    response = HttpResponse(image_data, content_type='image/png')
    response['X-Captcha-Token'] = signed
    response['Access-Control-Expose-Headers'] = 'X-Captcha-Token'
    return response


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def captcha_verify_view(request):
    captcha_code = request.data.get('captcha_code')
    captcha_token = request.data.get('captcha_token')
    try:
        expected = Signer().unsign(captcha_token or '')
    except BadSignature:
        return error(message='验证码已过期或无效', code=400)
    if captcha_code and expected.upper() == captcha_code.upper().strip():
        return success(message='验证码正确')
    return error(message='验证码错误或已过期', code=400)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
    except Exception:
        pass
    return success(message='退出成功')


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def current_user_view(request):
    if not request.user.is_authenticated:
        return error(message='未认证', code=401)

    user = request.user
    return success(data={
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
    })


class DashboardStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(status='active').count()
        total_projects = Project.objects.count()
        active_projects = Project.objects.filter(is_active=True).count()
        total_tasks = Task.objects.count()
        total_tags = Tag.objects.count()
        total_categories = Category.objects.count()

        user_growth = [120, 135, 148, 162, 178, 195, 210, 228, 245, 268, 290, 312]
        project_growth = [3, 5, 4, 6, 8, 7, 9, 10, 8, 11, 12, 14]

        data = {
            'total_users': total_users,
            'active_users': active_users,
            'total_projects': total_projects,
            'active_projects': active_projects,
            'total_tasks': total_tasks,
            'total_tags': total_tags,
            'total_categories': total_categories,
            'user_growth': user_growth,
            'project_growth': project_growth,
        }
        serializer = DashboardStatsSerializer(data)
        return success(data=serializer.data)


class UserViewSet(BaseViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    search_fields = ['username', 'email', 'first_name', 'last_name']
    filterset_fields = ['status', 'is_active']

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs


class ProjectViewSet(BaseViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    search_fields = ['name']
    filterset_fields = ['is_active']


class TaskViewSet(BaseViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    search_fields = ['name']
    filterset_fields = ['project']


class TagViewSet(BaseViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    search_fields = ['name']


class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    search_fields = ['name']


class LabelViewSet(BaseViewSet):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer
    search_fields = ['name']


class PostViewSet(BaseViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    search_fields = ['title']
    filterset_fields = ['user']


class InvoiceViewSet(BaseViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    search_fields = ['name']
    filterset_fields = ['user']


class ProfileViewSet(BaseViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    search_fields = ['name']


class GroupViewSet(BaseViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return GroupCreateUpdateSerializer
        return GroupSerializer


class PermissionListViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def list_permissions(self, request):
        perms = Permission.objects.select_related('content_type').all()
        grouped = {}
        for p in perms:
            app_label = p.content_type.app_label
            app_display = get_app_display_name(app_label)
            perm_display = get_permission_display_name(p.codename, p.name)

            if app_display not in grouped:
                grouped[app_display] = []
            grouped[app_display].append({
                'id': p.id,
                'codename': p.codename,
                'name': perm_display,
                'app_label': app_label,
            })
        return success(data=grouped)


class UserPermissionsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def my_permissions(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return error(message='用户不存在', code=404)
        serializer = UserPermissionSerializer(user)
        return success(data=serializer.data)


class MenuViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def user_menu(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return error(message='user_id is required', code=400)

        try:
            user = User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return error(message='用户不存在', code=404)

        if user.is_superuser:
            menu_items = MenuItem.objects.filter(is_active=True, parent__isnull=True)
            serializer = MenuItemSerializer(menu_items, many=True)
            return success(data=serializer.data)

        user_groups = user.groups.all()
        menu_item_ids = RoleMenu.objects.filter(
            group__in=user_groups
        ).values_list('menu_item_id', flat=True)

        menu_items = MenuItem.objects.filter(
            id__in=menu_item_ids,
            is_active=True,
            parent__isnull=True,
        ).order_by('order', 'id')

        serializer = MenuItemSerializer(menu_items, many=True)
        return success(data=serializer.data)

    @action(detail=False, methods=['get'])
    def all_menu(self, request):
        menu_items = MenuItem.objects.filter(parent__isnull=True)
        serializer = MenuItemSerializer(menu_items, many=True)
        return success(data=serializer.data)

    @action(detail=False, methods=['get'], url_path='group/(?P<group_id>[^/.]+)/menus')
    def group_menus(self, request, group_id=None):
        try:
            group = Group.objects.get(pk=group_id)
        except ObjectDoesNotExist:
            return error(message='角色不存在', code=404)
        menu_item_ids = RoleMenu.objects.filter(group=group).values_list('menu_item_id', flat=True)
        return success(data={'menu_ids': list(menu_item_ids)})

    @action(detail=False, methods=['post'], url_path='group/(?P<group_id>[^/.]+)/menus/update')
    def update_group_menus(self, request, group_id=None):
        try:
            group = Group.objects.get(pk=group_id)
        except ObjectDoesNotExist:
            return error(message='角色不存在', code=404)
        menu_ids = request.data.get('menu_ids', [])

        RoleMenu.objects.filter(group=group).delete()

        RoleMenu.objects.bulk_create([
            RoleMenu(group=group, menu_item_id=menu_id)
            for menu_id in menu_ids
        ])

        return success(data={'menu_ids': menu_ids}, message='更新成功')
