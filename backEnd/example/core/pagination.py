from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .responses import success


class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return success(data={
            'list': data,
            'pagination': {
                'total': self.page.paginator.count,
                'page': self.page.number,
                'page_size': self.get_page_size(self.request),
                'total_pages': self.page.paginator.num_pages,
            },
        })

    def get_paginated_response_schema(self, schema):
        return {
            'type': 'object',
            'properties': {
                'code': {'type': 'integer', 'example': 200},
                'message': {'type': 'string', 'example': 'success'},
                'data': {
                    'type': 'object',
                    'properties': {
                        'list': schema,
                        'pagination': {
                            'type': 'object',
                            'properties': {
                                'total': {'type': 'integer', 'example': 100},
                                'page': {'type': 'integer', 'example': 1},
                                'page_size': {'type': 'integer', 'example': 10},
                                'total_pages': {'type': 'integer', 'example': 10},
                            },
                        },
                    },
                },
            },
        }


class LargePagination(StandardPagination):
    page_size = 50
    max_page_size = 200


class SmallPagination(StandardPagination):
    page_size = 5
    max_page_size = 20
