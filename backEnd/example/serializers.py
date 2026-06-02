from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from .models import User, Tag, Category, Label, Project, Task, Post, Invoice, InvoiceItem, Profile, MenuItem
from .core.constants import get_permission_display_name


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'is_active']


class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'project', 'project_name', 'name']


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'name', 'invoice']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'user', 'user_username', 'name', 'items']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'name']


class PostSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'user_username', 'title', 'weight']


class UserSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    groups = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'is_staff', 'is_superuser',
            'status', 'approval', 'priority', 'color',
            'date_joined', 'last_login',
            'tags', 'projects', 'groups', 'password',
        ]

    def get_groups(self, obj):
        groups = obj.groups.all() if hasattr(obj, 'groups') else []
        return [{'id': g.id, 'name': g.name} for g in groups]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_projects = serializers.IntegerField()
    active_projects = serializers.IntegerField()
    total_tasks = serializers.IntegerField()
    total_tags = serializers.IntegerField()
    total_categories = serializers.IntegerField()
    user_growth = serializers.ListField(child=serializers.IntegerField())
    project_growth = serializers.ListField(child=serializers.IntegerField())


class PermissionSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Permission
        fields = ['id', 'codename', 'name', 'content_type', 'display_name']

    def get_display_name(self, obj):
        return get_permission_display_name(obj.codename, obj.name)


class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    user_count = serializers.SerializerMethodField()
    users = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions', 'user_count', 'users']

    def get_user_count(self, obj):
        return obj.user_set.count()

    def get_users(self, obj):
        users = obj.user_set.all()[:50]
        return [{'id': u.id, 'username': u.username} for u in users]


class GroupCreateUpdateSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Permission.objects.all(),
        required=False,
    )
    user_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        source='user_set',
        required=False,
        write_only=True,
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions', 'user_ids']

    def create(self, validated_data):
        permissions = validated_data.pop('permissions', [])
        users = validated_data.pop('user_set', [])
        group = Group.objects.create(**validated_data)
        group.permissions.set(permissions)
        group.user_set.set(users)
        return group

    def update(self, instance, validated_data):
        permissions = validated_data.pop('permissions', None)
        users = validated_data.pop('user_set', None)
        if permissions is not None:
            instance.permissions.set(permissions)
        if users is not None:
            instance.user_set.set(users)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UserPermissionSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'groups', 'permissions', 'is_superuser']

    def get_groups(self, obj):
        return [{'id': g.id, 'name': g.name} for g in obj.groups.all()]

    def get_permissions(self, obj):
        if obj.is_superuser:
            return ['*']
        perms = obj.get_all_permissions()
        return list(perms)


class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ['id', 'label', 'icon', 'path', 'parent', 'permission', 'order', 'group_label', 'is_active', 'children']

    def get_children(self, obj):
        if hasattr(obj, 'children') and obj.children is not None:
            return MenuItemSerializer(obj.children.filter(is_active=True), many=True).data
        return []
