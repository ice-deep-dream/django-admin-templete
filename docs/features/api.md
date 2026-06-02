---
title: REST API 功能
description: 了解项目提供的 REST API 接口
---

# REST API 功能

## API 概览

所有 API 接口位于 `/api/` 路径下，使用 JSON 格式进行数据交换。

### 认证方式

- **JWT Token** 认证
- 请求头携带 `Authorization: Bearer <token>`

### 响应格式

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/users/?page=2",
  "previous": null,
  "results": [...]
}
```

### 分页

- 默认每页 10 条
- 支持 `page` 参数翻页
- 返回总数和翻页链接

## 认证接口

### 登录

```
POST /api/auth/login/
```

请求体：
```json
{
  "username": "admin",
  "password": "admin123"
}
```

响应：
```json
{
  "access": "eyJ0eXAi...",
  "refresh": "eyJ0eXAi..."
}
```

### 登出

```
POST /api/auth/logout/
```

### 获取当前用户

```
GET /api/auth/me/
```

### 获取验证码

```
GET /api/auth/captcha/
```

### 验证验证码

```
POST /api/auth/captcha/verify/
```

## 用户接口

### 用户列表

```
GET /api/users/
```

查询参数：
- `page` - 页码
- `search` - 搜索关键词
- `ordering` - 排序字段

### 用户详情

```
GET /api/users/{id}/
```

### 创建用户

```
POST /api/users/
```

### 更新用户

```
PUT /api/users/{id}/
PATCH /api/users/{id}/
```

### 删除用户

```
DELETE /api/users/{id}/
```

## 项目接口

### 项目列表

```
GET /api/projects/
```

### 项目详情

```
GET /api/projects/{id}/
```

### 创建项目

```
POST /api/projects/
```

### 更新项目

```
PUT /api/projects/{id}/
```

### 删除项目

```
DELETE /api/projects/{id}/
```

## 任务接口

### 任务列表

```
GET /api/tasks/
```

### 任务详情

```
GET /api/tasks/{id}/
```

### 创建任务

```
POST /api/tasks/
```

### 更新任务

```
PUT /api/tasks/{id}/
```

### 删除任务

```
DELETE /api/tasks/{id}/
```

## 分类标签接口

### 标签

```
GET    /api/tags/          # 标签列表
POST   /api/tags/          # 创建标签
GET    /api/tags/{id}/     # 标签详情
PUT    /api/tags/{id}/     # 更新标签
DELETE /api/tags/{id}/     # 删除标签
```

### 分类

```
GET    /api/categories/    # 分类列表
POST   /api/categories/    # 创建分类
GET    /api/categories/{id}/ # 分类详情
PUT    /api/categories/{id}/ # 更新分类
DELETE /api/categories/{id}/ # 删除分类
```

### Label

```
GET    /api/labels/        # Label列表
POST   /api/labels/        # 创建Label
GET    /api/labels/{id}/   # Label详情
PUT    /api/labels/{id}/   # 更新Label
DELETE /api/labels/{id}/   # 删除Label
```

## 文章接口

```
GET    /api/posts/         # 文章列表
POST   /api/posts/         # 创建文章
GET    /api/posts/{id}/    # 文章详情
PUT    /api/posts/{id}/    # 更新文章
DELETE /api/posts/{id}/    # 删除文章
```

## 发票接口

```
GET    /api/invoices/      # 发票列表
POST   /api/invoices/      # 创建发票
GET    /api/invoices/{id}/ # 发票详情
PUT    /api/invoices/{id}/ # 更新发票
DELETE /api/invoices/{id}/ # 删除发票
```

## 用户资料接口

```
GET    /api/profiles/      # 资料列表
POST   /api/profiles/      # 创建资料
GET    /api/profiles/{id}/ # 资料详情
PUT    /api/profiles/{id}/ # 更新资料
DELETE /api/profiles/{id}/ # 删除资料
```

## 角色接口

```
GET    /api/groups/        # 角色列表
POST   /api/groups/        # 创建角色
GET    /api/groups/{id}/   # 角色详情
PUT    /api/groups/{id}/   # 更新角色
DELETE /api/groups/{id}/   # 删除角色
```

## 权限接口

### 权限列表

```
GET /api/permissions/
```

### 用户权限

```
GET /api/user-permissions/
```

## 菜单接口

### 获取菜单

```
GET /api/menu/
```

返回当前用户有权限访问的菜单树。

## 仪表盘接口

### 统计数据

```
GET /api/dashboard/
```

返回仪表盘统计数据。
