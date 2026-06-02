from rest_framework import status
from rest_framework.views import exception_handler
from rest_framework.exceptions import (
    APIException,
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    NotFound,
    ValidationError,
    MethodNotAllowed,
    Throttled,
)

from .responses import error


class BusinessException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = '业务异常'
    default_code = 'business_error'

    def __init__(self, message=None, code=None, status_code=None):
        if message:
            self.default_detail = message
        if code:
            self.default_code = code
        if status_code:
            self.status_code = status_code
        super().__init__(detail=self.default_detail)


class NotFoundError(BusinessException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = '资源不存在'
    default_code = 'not_found'


class ConflictError(BusinessException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = '资源冲突'
    default_code = 'conflict'


class ForbiddenError(BusinessException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = '无权限访问'
    default_code = 'forbidden'


class UnauthorizedError(BusinessException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = '未认证'
    default_code = 'unauthorized'


EXCEPTION_MAP = {
    ValidationError: (status.HTTP_422_UNPROCESSABLE_ENTITY, '参数验证失败'),
    NotAuthenticated: (status.HTTP_401_UNAUTHORIZED, '未认证，请先登录'),
    AuthenticationFailed: (status.HTTP_401_UNAUTHORIZED, '认证失败'),
    PermissionDenied: (status.HTTP_403_FORBIDDEN, '无权限执行此操作'),
    NotFound: (status.HTTP_404_NOT_FOUND, '资源不存在'),
    MethodNotAllowed: (status.HTTP_405_METHOD_NOT_ALLOWED, '请求方法不允许'),
    Throttled: (status.HTTP_429_TOO_MANY_REQUESTS, '请求过于频繁'),
}


def custom_exception_handler(exc, context):
    if isinstance(exc, BusinessException):
        return error(
            message=str(exc.detail) if hasattr(exc, 'detail') else str(exc),
            code=exc.status_code,
        )

    if isinstance(exc, ValidationError):
        errors = exc.detail if isinstance(exc.detail, dict) else {'detail': exc.detail}
        return error(
            message='参数验证失败',
            code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            errors=errors,
        )

    mapped = EXCEPTION_MAP.get(type(exc))
    if mapped:
        code, message = mapped
        return error(message=message, code=code)

    if isinstance(exc, APIException):
        return error(message=str(exc.detail), code=exc.status_code)

    import logging
    logger = logging.getLogger(__name__)
    logger.error(f'Unhandled exception: {exc}', exc_info=True)

    from django.conf import settings
    if settings.DEBUG:
        return error(
            message=f'服务器内部错误: {exc}',
            code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return error(
        message='服务器内部错误',
        code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
