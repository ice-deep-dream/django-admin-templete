from rest_framework import viewsets, status
from django.db.models import Q

from .responses import success, created, no_content, error
from .pagination import StandardPagination
from .permissions import ModelPermission
from .serializers import BulkDeleteSerializer


class BaseViewSet(viewsets.ModelViewSet):
    pagination_class = StandardPagination
    permission_classes = [ModelPermission]
    search_fields = []
    filterset_fields = []
    ordering_fields = ['id']
    ordering = ['-id']

    def get_queryset(self):
        qs = super().get_queryset()
        params = getattr(self.request, 'query_params', None) or getattr(self.request, 'GET', {})
        search = params.get('search')
        if search and self.search_fields:
            query = Q()
            for field in self.search_fields:
                query |= Q(**{f'{field}__icontains': search})
            qs = qs.filter(query)
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return success(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return created(data=serializer.data, message='创建成功')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return success(data=serializer.data, message='更新成功')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return no_content(message='删除成功')

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


class ReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = StandardPagination
    permission_classes = [ModelPermission]
    search_fields = []
    filterset_fields = []
    ordering_fields = ['id']
    ordering = ['-id']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return success(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success(data=serializer.data)
