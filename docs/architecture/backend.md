---
title: 后端架构
description: 了解后端项目的架构设计
---

# 后端架构

## 目录结构

```
backEnd/
├── manage.py                    # Django 管理脚本
├── pyproject.toml               # Python 项目配置
├── unfold/                      # Unfold 管理后台框架
│   ├── admin.py                 # ModelAdmin 基类
│   ├── sites.py                 # 自定义 AdminSite
│   ├── components.py            # UI 组件系统
│   ├── datasets.py              # 数据集功能
│   ├── decorators.py            # 装饰器
│   ├── forms.py                 # 表单类
│   ├── layout.py                # 布局系统
│   ├── paginator.py             # 分页器
│   ├── sections.py              # 侧边栏分区
│   ├── settings.py              # 配置处理
│   ├── mixins/                  # Mixin 类
│   │   ├── action_model_admin.py
│   │   ├── dataset_model_admin.py
│   │   ├── formfield_model_admin.py
│   │   └── nested_inlines_model_admin.py
│   ├── contrib/                 # 第三方集成
│   │   ├── filters/             # 高级过滤器
│   │   ├── forms/               # 表单组件
│   │   ├── inlines/             # 内联增强
│   │   ├── import_export/       # 导入导出
│   │   ├── guardian/            # 对象权限
│   │   ├── simple_history/      # 历史记录
│   │   ├── location_field/      # 地理位置
│   │   └── constance/           # 动态配置
│   └── templates/               # HTML 模板
└── example/                     # 业务应用
    ├── settings.py              # Django 配置
    ├── urls.py                  # URL 路由
    ├── api_urls.py              # API 路由
    ├── models.py                # 数据模型
    ├── admin.py                 # 管理后台
    ├── api_views.py             # API 视图
    ├── serializers.py           # 序列化器
    └── core/                    # 核心模块
        ├── middleware.py        # 请求日志中间件
        ├── permissions.py       # 权限类
        ├── pagination.py        # 分页器
        ├── serializers.py       # 基础序列化器
        ├── responses.py         # 统一响应
        ├── exceptions.py        # 异常处理
        ├── constants.py         # 常量定义
        ├── captcha.py           # 验证码
        └── viewsets.py          # 基础 ViewSet
```

## 配置架构

### 应用分层

```python
INSTALLED_APPS = [
    "unfold",                    # 1. UI 框架
    "unfold.contrib.filters",    # 2. Unfold 扩展
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "unfold.contrib.import_export",
    "unfold.contrib.guardian",
    "unfold.contrib.simple_history",
    "unfold.contrib.location_field",
    "unfold.contrib.constance",
    "django.contrib.admin",      # 3. Django Admin
    "django.contrib.auth",
    # ... Django 内置应用
    "rest_framework",            # 4. REST Framework
    "rest_framework_simplejwt",
    "corsheaders",               # 5. CORS
    "example",                   # 6. 业务应用
    "constance",                 # 7. 动态配置
    "import_export",             # 8. 第三方扩展
]
```

### 中间件链

```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",          # CORS 处理
    "django.middleware.security.SecurityMiddleware",  # 安全
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "example.core.middleware.RequestLoggingMiddleware", # 请求日志
]
```

## API 架构

### 路由设计

```
/api/
├── auth/
│   ├── login/           # 登录
│   ├── logout/          # 登出
│   ├── me/              # 当前用户
│   ├── captcha/         # 验证码
│   └── captcha/verify/  # 验证验证码
├── dashboard/           # 仪表盘统计
├── users/               # 用户管理
├── projects/            # 项目管理
├── tasks/               # 任务管理
├── tags/                # 标签管理
├── categories/          # 分类管理
├── labels/              # 标签管理
├── posts/               # 文章管理
├── invoices/            # 发票管理
├── profiles/            # 用户资料
├── groups/              # 角色管理
├── permissions/         # 权限列表
├── user-permissions/    # 用户权限
└── menu/                # 菜单管理
```

### ViewSet 基类

```python
class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination
```

## 权限架构

### 三层权限

1. **用户权限** - Django 内置用户权限系统
2. **对象权限** - django-guardian 对象级权限
3. **菜单权限** - RoleMenu 模型控制菜单访问

### 权限模型

```
User → Groups → Permissions
              → RoleMenu → MenuItem
```
