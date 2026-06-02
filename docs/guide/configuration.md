---
title: 项目配置
description: 了解项目的配置方式和环境变量
---

# 项目配置

## 后端配置

### 环境变量

在 `backEnd/example/settings.py` 中配置以下环境变量：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `SECRET_KEY` | Django 密钥 | 随机生成 |
| `DEBUG` | 调试模式 | `true` |
| `ALLOWED_HOSTS` | 允许的主机 | `localhost,127.0.0.1,0.0.0.0,testserver` |

### 核心配置

```python
# 自定义用户模型
AUTH_USER_MODEL = "example.User"

# 数据库（默认 SQLite）
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# 缓存
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}
```

### CORS 配置

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]
CORS_ALLOW_CREDENTIALS = True
```

### JWT 配置

```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=2),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}
```

### REST Framework 配置

```python
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "example.core.pagination.StandardPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}
```

## 前端配置

### Vite 配置

前端使用 Vite 作为构建工具，配置文件位于 `frontEnd/vite.config.ts`。

### TypeScript 配置

TypeScript 配置位于 `frontEnd/tsconfig.json`，支持严格类型检查。

### 路径别名

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 动态配置

项目使用 `django-constance` 支持运行时动态配置：

- 站点名称和描述
- 主题和样式
- 维护模式
- 缓存设置
- 社交媒体链接

在 Django Admin 的 `CONSTANCE` 页面中修改这些配置。
