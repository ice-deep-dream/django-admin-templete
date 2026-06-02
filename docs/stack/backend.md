---
title: 后端技术栈
description: 了解后端使用的技术栈
---

# 后端技术栈

## 核心框架

### Django 5.1+

- **Web 框架**：提供完整的 MVC 架构
- **ORM**：强大的对象关系映射
- **Admin**：内置管理后台
- **Auth**：用户认证和权限系统

### Django REST Framework

- **序列化器**：模型数据与 JSON 转换
- **ViewSet**：RESTful API 视图
- **Router**：自动路由生成
- **认证**：JWT、Session 认证
- **权限**：细粒度权限控制
- **分页**：标准分页器

### Django Unfold

- **现代化 UI**：基于 Tailwind CSS 的管理界面
- **组件系统**：可复用的 UI 组件
- **主题定制**：深色模式、自定义颜色
- **响应式设计**：适配各种屏幕尺寸

## 数据库

### SQLite（默认）

- 开发环境默认数据库
- 零配置，开箱即用
- 可替换为 PostgreSQL/MySQL

### 缓存

- **LocMemCache**：本地内存缓存
- 支持 Redis/Memcached 扩展

## 认证与安全

### JWT 认证

| 库 | 用途 |
|----|------|
| `djangorestframework-simplejwt` | JWT Token 生成和验证 |
| `token_blacklist` | Token 黑名单管理 |

### 安全特性

| 特性 | 说明 |
|------|------|
| CSRF 保护 | 跨站请求伪造防护 |
| XSS 防护 | 跨站脚本攻击防护 |
| CORS 控制 | 跨域资源共享控制 |
| 限流 | API 请求频率限制 |

## 第三方集成

| 库 | 版本 | 用途 |
|----|------|------|
| `django-cors-headers` | - | CORS 跨域处理 |
| `django-guardian` | - | 对象级权限 |
| `django-import-export` | - | 数据导入导出 |
| `django-simple-history` | - | 模型历史记录 |
| `django-constance` | - | 动态配置管理 |
| `django-crispy-forms` | - | 表单渲染 |
| `django-location-field` | - | 地理位置字段 |
| `djangoql` | - | 高级查询语言 |
| `django-money` | - | 货币处理 |
| `django-modeltranslation` | - | 多语言支持 |
| `django-json-widget` | - | JSON 编辑器 |
| `django-celery-beat` | - | 定时任务 |

## 开发工具

| 工具 | 用途 |
|------|------|
| `uv` | Python 包管理器（推荐） |
| `ruff` | 代码检查 |
| `black` | 代码格式化 |
| `pytest` | 测试框架 |
| `factory_boy` | 测试数据工厂 |
| `pre-commit` | Git 钩子 |

## 中间件

| 中间件 | 用途 |
|--------|------|
| `CorsMiddleware` | CORS 跨域处理 |
| `SecurityMiddleware` | 安全防护 |
| `SessionMiddleware` | 会话管理 |
| `CsrfViewMiddleware` | CSRF 防护 |
| `AuthenticationMiddleware` | 用户认证 |
| `MessageMiddleware` | 消息框架 |
| `XFrameOptionsMiddleware` | 点击劫持防护 |
| `RequestLoggingMiddleware` | 请求日志记录 |
