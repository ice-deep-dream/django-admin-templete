---
title: 快速开始
description: 了解如何快速启动 Django Admin Template 项目
---

# 快速开始

## 环境要求

| 依赖 | 版本要求 |
|------|----------|
| Python | 3.12+ |
| Node.js | 18+ |
| uv | 推荐（Python 包管理器） |
| npm | 9+ |

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/ice-deep-dream/django-admin-templete.git
cd django-admin-templete
```

### 2. 安装后端依赖

```bash
cd backEnd
uv sync
```

### 3. 安装前端依赖

```bash
cd ../frontEnd
npm install
```

### 4. 数据库迁移

```bash
cd ../backEnd
uv run python manage.py migrate
```

### 5. 创建超级用户

```bash
uv run python manage.py createsuperuser
```

### 6. 启动服务

```bash
# 启动后端服务
uv run python manage.py runserver 0.0.0.0:8000

# 另开终端，启动前端开发服务
cd ../frontEnd
npm run dev
```

## 默认账号

| 账号 | 密码 | 角色 | 权限 |
|------|------|------|------|
| admin | admin123 | 超级管理员 | 全部权限 |
| editor | editor123 | 编辑 | 增/改/查 |
| viewer | viewer123 | 只读用户 | 仅查看 |

## 访问地址

- **Django Admin**: http://localhost:8000/admin
- **React 前端**: http://localhost:5173

## 下一步

- 查看 [架构概览](/architecture/overview) 了解项目设计
- 查看 [技术栈](/stack/backend) 了解使用的技术
- 查看 [功能文档](/features/admin) 了解详细功能
