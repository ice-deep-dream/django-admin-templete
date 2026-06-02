from rest_framework.permissions import BasePermission


class ModelPermission(BasePermission):
    ACTION_MAP = {
        'list': 'view',
        'retrieve': 'view',
        'create': 'add',
        'update': 'change',
        'partial_update': 'change',
        'destroy': 'delete',
    }

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        if not hasattr(view, 'queryset') or view.queryset is None:
            return True

        action = self.ACTION_MAP.get(view.action, view.action)
        model_name = view.queryset.model._meta.model_name
        app_label = view.queryset.model._meta.app_label

        perm_codename = f'{app_label}.{action}_{model_name}'
        return request.user.has_perm(perm_codename)

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        model_name = obj._meta.model_name
        app_label = obj._meta.app_label

        method_perm = {
            'GET': 'view',
            'OPTIONS': 'view',
            'PUT': 'change',
            'PATCH': 'change',
            'DELETE': 'delete',
        }

        action = method_perm.get(request.method)
        if not action:
            return True

        perm_codename = f'{app_label}.{action}_{model_name}'
        return request.user.has_perm(perm_codename)


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)
