from rest_framework.response import Response
from rest_framework import status


class ApiResponse(Response):
    def __init__(
        self,
        data=None,
        code=status.HTTP_200_OK,
        message='success',
        headers=None,
    ):
        body = {
            'code': code,
            'message': message,
            'data': data,
        }
        super().__init__(data=body, status=code, headers=headers)


def success(data=None, message='success', code=status.HTTP_200_OK):
    return ApiResponse(data=data, code=code, message=message)


def created(data=None, message='created'):
    return ApiResponse(data=data, code=status.HTTP_201_CREATED, message=message)


def no_content(message='deleted'):
    return ApiResponse(data=None, code=status.HTTP_204_NO_CONTENT, message=message)


def error(
    message='error',
    code=status.HTTP_400_BAD_REQUEST,
    data=None,
    errors=None,
):
    body = {
        'code': code,
        'message': message,
        'data': data,
    }
    if errors is not None:
        body['errors'] = errors
    return Response(data=body, status=code)
